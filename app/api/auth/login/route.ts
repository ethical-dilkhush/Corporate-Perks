import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateOTP } from '@/lib/auth-utils'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
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
      message: 'OTP sent successfully',
      userId: authData.user?.id 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
