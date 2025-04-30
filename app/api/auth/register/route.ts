import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateOTP } from '@/lib/auth-utils'

export async function POST(req: Request) {
  try {
    const { email, password, name, role } = await req.json()

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
      }

    // Create user profile in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user?.id,
          email,
          name,
          role,
        }
      ])
      .select()
      .single()

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    const { error: otpError } = await supabase
      .from('otp_verifications')
      .insert([
        {
          user_id: authData.user?.id,
          otp,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        }
      ])

    if (otpError) {
      return NextResponse.json(
        { error: otpError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      message: 'User registered successfully. Please verify your email.',
      userId: authData.user?.id 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
