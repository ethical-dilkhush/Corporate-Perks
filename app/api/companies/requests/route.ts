import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("company_registration_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ requests: data ?? [] })
  } catch (error) {
    console.error("Fetch registration requests error:", error)
    return NextResponse.json(
      { error: "Failed to fetch registration requests" },
      { status: 500 }
    )
  }
}




