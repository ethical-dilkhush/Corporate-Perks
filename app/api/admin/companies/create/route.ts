import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"

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

type CompanyPayload = {
  name: string
  industry: string
  website: string
  taxId: string
  description: string
  contactName: string
  contactEmail: string
  contactPhone: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  password: string
}

const requiredFields: Array<keyof CompanyPayload> = [
  "name",
  "industry",
  "website",
  "taxId",
  "description",
  "contactName",
  "contactEmail",
  "contactPhone",
  "address",
  "city",
  "state",
  "country",
  "postalCode",
  "password",
]

function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
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

  let body: Partial<CompanyPayload> = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 })
  }

  for (const field of requiredFields) {
    if (!isValidString(body[field])) {
      return NextResponse.json(
        { error: `Missing or invalid field: ${field}` },
        { status: 400 },
      )
    }
  }

  const payload = {
    ...body,
    contactEmail: body.contactEmail!.trim().toLowerCase(),
  } as CompanyPayload

  try {
    const { data: existingCompany, error: existingCompanyError } = await supabaseAdmin
      .from("companies")
      .select("id, status")
      .or(`contact_email.eq.${payload.contactEmail},email.eq.${payload.contactEmail}`)
      .maybeSingle()

    if (existingCompanyError) throw existingCompanyError
    if (existingCompany) {
      return NextResponse.json(
        {
          error:
            existingCompany.status === "Active"
              ? "A company with this email already exists."
              : "A company with this email is already registered.",
        },
        { status: 409 },
      )
    }

    const { data: existingRequest, error: existingRequestError } = await supabaseAdmin
      .from("company_registration_requests")
      .select("id, status")
      .eq("contact_email", payload.contactEmail)
      .maybeSingle()

    if (existingRequestError) throw existingRequestError
    if (existingRequest) {
      return NextResponse.json(
        {
          error:
            existingRequest.status === "rejected"
              ? "This email previously submitted a rejected request. Please ask them to resubmit."
              : "This company already has a pending registration request.",
        },
        { status: 409 },
      )
    }

    const { data: createdUser, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email: payload.contactEmail,
        password: payload.password,
        email_confirm: true,
        user_metadata: {
          role: "company",
          company_name: payload.name,
        },
      })

    if (createUserError || !createdUser?.user) {
      return NextResponse.json(
        { error: createUserError?.message || "Unable to create company account." },
        { status: 400 },
      )
    }

    const companyRecord = {
      id: createdUser.user.id,
      name: payload.name,
      email: payload.contactEmail,
      industry: payload.industry,
      website: payload.website,
      tax_id: payload.taxId,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      country: payload.country,
      postal_code: payload.postalCode,
      contact_name: payload.contactName,
      contact_email: payload.contactEmail,
      contact_phone: payload.contactPhone,
      status: "Active",
      created_at: new Date().toISOString(),
    }

    const { error: insertCompanyError } = await supabaseAdmin
      .from("companies")
      .insert(companyRecord)

    if (insertCompanyError) {
      await supabaseAdmin.auth.admin.deleteUser(createdUser.user.id)
      return NextResponse.json(
        { error: insertCompanyError.message || "Failed to save company record." },
        { status: 500 },
      )
    }

    // Best-effort: log the request as already approved for auditing consistency
    try {
      await supabaseAdmin.from("company_registration_requests").insert([
        {
          name: payload.name,
          industry: payload.industry,
          address: payload.address,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          postal_code: payload.postalCode,
          website: payload.website,
          tax_id: payload.taxId,
          description: payload.description,
          contact_name: payload.contactName,
          contact_email: payload.contactEmail,
          contact_phone: payload.contactPhone,
          password: payload.password,
          status: "approved",
        },
      ])
    } catch (requestLogError) {
      console.error("Failed to log approved registration request:", requestLogError)
    }

    return NextResponse.json({ success: true, company: companyRecord })
  } catch (error) {
    console.error("Admin company creation error:", error)
    return NextResponse.json(
      { error: "Failed to create company. Please try again later." },
      { status: 500 },
    )
  }
}

