import { NextResponse } from "next/server"
import { cookies } from "next/headers"
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

export async function POST(request: Request) {
  try {
    const { offerId, eventType, metadata } = await request.json()

    if (!offerId || !eventType) {
      return NextResponse.json(
        { error: "offerId and eventType are required" },
        { status: 400 },
      )
    }

    const sessionCookie = cookies().get("employee_session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let employeeId: number | null = null

    try {
      const parsed = JSON.parse(sessionCookie.value)
      employeeId = parsed?.id ?? null
    } catch (error) {
      console.error("Failed to parse employee session:", error)
    }

    const { data: offer, error: offerError } = await supabaseAdmin
      .from("offers")
      .select("id, partner_id")
      .eq("id", offerId)
      .single()

    if (offerError || !offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 })
    }

    const { data: partner, error: partnerError } = await supabaseAdmin
      .from("partners")
      .select("partner_company_id")
      .eq("id", offer.partner_id)
      .single()

    if (partnerError && partnerError?.code !== "PGRST116") {
      console.error("Failed to load partner for event logging:", partnerError)
    }

    const companyIdForEvent = partner?.partner_company_id || offer.partner_id

    const { error: insertError } = await supabaseAdmin.from("offer_events").insert({
      company_id: companyIdForEvent,
      offer_id: offer.id,
      employee_id: employeeId,
      event_type: eventType,
      metadata: metadata ?? null,
    })

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Offer event logging error:", error)
    return NextResponse.json(
      { error: "Failed to record analytics event" },
      { status: 500 },
    )
  }
}


