import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function POST(request: Request) {
  try {
    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      )
    }

    const { data: requestData, error: requestError } = await supabaseAdmin
      .from("company_registration_requests")
      .select("*")
      .eq("id", requestId)
      .single()

    if (requestError || !requestData) {
      return NextResponse.json(
        { error: "Registration request not found" },
        { status: 404 }
      )
    }

    if (requestData.contact_email) {
      await supabaseAdmin
        .from("companies")
        .delete()
        .eq("email", requestData.contact_email)
    }

    const { error: updateError } = await supabaseAdmin
      .from("company_registration_requests")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId)

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update request status" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reject company request error:", error)
    return NextResponse.json(
      { error: "Failed to reject company request" },
      { status: 500 }
    )
  }
}




