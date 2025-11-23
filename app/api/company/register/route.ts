import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      industry,
      address,
      city,
      state,
      country,
      postalCode,
      contactName,
      contactEmail,
      contactPhone,
      website,
      taxId,
      description,
      password,
    } = body

    if (
      !name ||
      !industry ||
      !address ||
      !city ||
      !state ||
      !country ||
      !postalCode ||
      !contactName ||
      !contactEmail ||
      !contactPhone ||
      !password ||
      !taxId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Prevent duplicate company accounts
    const { data: existingCompany } = await supabaseAdmin
      .from("companies")
      .select("id, email")
      .eq("email", contactEmail)
      .maybeSingle()

    if (existingCompany) {
      return NextResponse.json(
        { error: "An active company account already exists for this email." },
        { status: 409 }
      )
    }

    // Prevent duplicate registration requests
    const { data: existingRequest } = await supabaseAdmin
      .from("company_registration_requests")
      .select("id, status")
      .eq("contact_email", contactEmail)
      .maybeSingle()

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return NextResponse.json(
          { error: "A registration request for this email is already pending approval." },
          { status: 409 }
        )
      }

      if (existingRequest.status === "approved") {
        return NextResponse.json(
          { error: "This email has already been approved. Please try logging in." },
          { status: 409 }
        )
      }
    }

    const { error } = await supabaseAdmin
      .from("company_registration_requests")
      .insert([
        {
          name,
          industry,
          address,
          city,
          state,
          country,
          postal_code: postalCode,
          website,
          tax_id: taxId,
          description,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          password,
          status: "pending",
        },
      ])

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Unable to submit registration request." },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Company registration error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
