import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: Request) {
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get employee session
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('employee_session')
    
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const session = JSON.parse(sessionCookie.value)
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || null

    // Get employee ID using the session
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('id')
      .eq('email', session.email)
      .single()

    if (employeeError || !employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Get coupons
    let query = supabase
      .from('coupons')
      .select(`
        *,
        offer:offer_id (
          id,
          title,
          company_name,
          discount_value,
          image_url
        )
      `)
      .eq('employee_id', employee.id)
      .order('created_at', { ascending: false })
    
    // Add status filter if provided
    if (status) {
      query = query.eq('status', status.toUpperCase())
    }
    
    const { data: coupons, error: couponsError } = await query

    if (couponsError) {
      throw couponsError
    }

    return NextResponse.json({ coupons: coupons || [] })
  } catch (error) {
    console.error("Get coupons error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
