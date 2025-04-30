import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { userId, otp } = await req.json()

    // Get the OTP verification record
    const { data: otpVerification, error: otpError } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('user_id', userId)
      .eq('otp', otp)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (otpError || !otpVerification) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Update OTP as used
    const { error: updateError } = await supabase
      .from('otp_verifications')
      .update({ used: true })
      .eq('id', otpVerification.id)

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 400 }
      )
    }

    // Update user as verified
    const { error: userError } = await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('id', userId)

    if (userError) {
      return NextResponse.json(
        { error: userError.message },
        { status: 400 }
      )
    }

    // Get user data
    const { data: user, error: getUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (getUserError) {
      return NextResponse.json(
        { error: getUserError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      message: 'OTP verified successfully',
      user 
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
