import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: Request) {
  try {
    const { requestId } = await request.json()

    // 1. Get the request details
    const { data: requestData, error: fetchError } = await supabaseAdmin
      .from('company_registration_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !requestData) {
      return NextResponse.json(
        { error: 'Failed to fetch request details' },
        { status: 400 }
      )
    }

    // 2. Create and auto-verify the auth user using admin client
    const { data: { user }, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: requestData.contact_email,
      password: requestData.password,
      email_confirm: true,
      user_metadata: {
        role: 'company',
        company_name: requestData.name
      }
    })

    if (createUserError || !user) {
      console.error('Create user error:', createUserError)
      return NextResponse.json(
        { error: createUserError?.message || 'Failed to create auth user' },
        { status: 400 }
      )
    }

    // 3. Update request status
    const { error: updateError } = await supabaseAdmin
      .from('company_registration_requests')
      .update({ status: 'approved', updated_at: new Date().toISOString() })
      .eq('id', requestId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update request status' },
        { status: 400 }
      )
    }

    // 4. Create company record
    const companyData = {
      id: user.id,
      name: requestData.name,
      email: requestData.contact_email,
      industry: requestData.industry,
      website: requestData.website,
      tax_id: requestData.tax_id,
      description: requestData.description,
      address: requestData.address,
      city: requestData.city,
      state: requestData.state,
      country: requestData.country,
      postal_code: requestData.postal_code,
      contact_name: requestData.contact_name,
      contact_email: requestData.contact_email,
      contact_phone: requestData.contact_phone,
      status: 'Active',
      created_at: new Date().toISOString()
    }

    const { error: companyError } = await supabaseAdmin
      .from('companies')
      .insert(companyData)

    if (companyError) {
      return NextResponse.json(
        { error: 'Failed to create company record' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Company approved successfully',
      password: requestData.password,
    })
  } catch (error) {
    console.error('Error in approve company route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 