import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function POST(request: Request) {
  try {
    const {
      companyId,
      name,
      email,
      role,
      password,
    } = await request.json()

    if (!companyId || !name || !email || !role || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    // Ensure employee email is unique
    const { data: existingEmployee } = await supabaseAdmin
      .from("employees")
      .select("id")
      .eq("email", email)
      .maybeSingle()

    if (existingEmployee) {
      return NextResponse.json(
        { error: "An employee with this email already exists." },
        { status: 409 },
      )
    }

    // Create Supabase auth user
    const { data: createUserResult, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: "employee",
          company_id: companyId,
          name,
        },
      })

    if (createUserError || !createUserResult?.user) {
      return NextResponse.json(
        { error: createUserError?.message || "Failed to create user account." },
        { status: 400 },
      )
    }

    const { error: insertError } = await supabaseAdmin
      .from("employees")
      .insert({
        auth_id: createUserResult.user.id,
        company_id: companyId,
        name,
        email,
        role,
        status: "active",
        password_hash: password,
        redemptions: 0,
        savings: 0,
      })

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      employeeId: createUserResult.user.id,
    })
  } catch (error) {
    console.error("Add employee error:", error)
    return NextResponse.json(
      { error: "Failed to create employee." },
      { status: 500 },
    )
  }
}

