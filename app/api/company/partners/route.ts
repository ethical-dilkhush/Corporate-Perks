import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

const COMPANY_COLUMNS =
  "id,name,industry,website,address,city,state,country,postal_code,contact_email,contact_phone,status"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("companies")
      .select(COMPANY_COLUMNS)
      .eq("status", "Active")
      .neq("id", user.id)
      .order("name", { ascending: true })

    if (error) {
      console.error("Partners GET error:", error)
      return NextResponse.json(
        { error: "Failed to load companies." },
        { status: 500 },
      )
    }

    return NextResponse.json({ companies: data ?? [] })
  } catch (error) {
    console.error("Partners GET unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to load companies." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { companyId?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body.companyId) {
    return NextResponse.json({ error: "Company ID is required." }, { status: 400 })
  }

  try {
    const [{ data: ownerCompany, error: ownerError }, { data: partnerCompany, error: partnerError }] =
      await Promise.all([
        supabaseAdmin
          .from("companies")
          .select(COMPANY_COLUMNS)
          .eq("id", user.id)
          .single(),
        supabaseAdmin
          .from("companies")
          .select(COMPANY_COLUMNS)
          .eq("id", body.companyId)
          .single(),
      ])

    if (ownerError || !ownerCompany) {
      return NextResponse.json(
        { error: "Unable to verify your company profile." },
        { status: 400 },
      )
    }

    if (ownerCompany.status !== "Active") {
      return NextResponse.json(
        { error: "Only approved companies can manage partners." },
        { status: 400 },
      )
    }

    if (partnerError || !partnerCompany) {
      return NextResponse.json(
        { error: "Selected company not found." },
        { status: 404 },
      )
    }

    if (partnerCompany.status !== "Active") {
      return NextResponse.json(
        { error: "Only approved companies can be added as partners." },
        { status: 400 },
      )
    }

    if (partnerCompany.id === ownerCompany.id) {
      return NextResponse.json(
        { error: "You cannot add your own company as a partner." },
        { status: 400 },
      )
    }

    const { data: existing } = await supabaseAdmin
      .from("partners")
      .select("id")
      .eq("owner_company_id", ownerCompany.id)
      .eq("partner_company_id", partnerCompany.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: "This partnership already exists." },
        { status: 409 },
      )
    }

    const partnerData = {
      owner_company_id: ownerCompany.id,
      partner_company_id: partnerCompany.id,
      company_name: partnerCompany.name ?? "",
      business_type: partnerCompany.industry ?? "General",
      website: partnerCompany.website ?? "",
      additional_note: "Imported from approved companies list",
      email: partnerCompany.contact_email ?? "",
      phone: partnerCompany.contact_phone ?? "",
      address: partnerCompany.address ?? "",
      city: partnerCompany.city ?? "",
      state: partnerCompany.state ?? "",
      country: partnerCompany.country ?? "",
      pincode: partnerCompany.postal_code ?? "",
      employee_count: null,
      partnership_type: "Standard",
      image_url: null,
      created_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabaseAdmin
      .from("partners")
      .insert([partnerData])

    if (insertError) {
      console.error("Partners POST insert error:", insertError)
      return NextResponse.json(
        { error: insertError.message || "Failed to create partner." },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, partner: partnerData })
  } catch (error) {
    console.error("Partners POST unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to create partner." },
      { status: 500 },
    )
  }
}

