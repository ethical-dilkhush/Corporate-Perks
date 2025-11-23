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
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .select(COMPANY_COLUMNS)
      .eq("id", body.companyId)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: "Selected company not found." },
        { status: 404 },
      )
    }

    if (company.status !== "Active") {
      return NextResponse.json(
        { error: "Only approved companies can be added as partners." },
        { status: 400 },
      )
    }

    const { data: existing } = await supabaseAdmin
      .from("partners")
      .select("id")
      .eq("company_id", company.id)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: "This company is already a partner." },
        { status: 409 },
      )
    }

    const partnerData = {
      company_id: company.id,
      company_name: company.name ?? "",
      business_type: company.industry ?? "General",
      website: company.website ?? "",
      additional_note: "Imported from approved companies list",
      email: company.contact_email ?? "",
      phone: company.contact_phone ?? "",
      address: company.address ?? "",
      city: company.city ?? "",
      state: company.state ?? "",
      country: company.country ?? "",
      pincode: company.postal_code ?? "",
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

