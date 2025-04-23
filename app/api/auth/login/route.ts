import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateOTP, sendOTPEmail } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found. Please register first." }, { status: 404 })
    }

    // Generate OTP
    const otpCode = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save OTP to database
    await prisma.otpVerification.create({
      data: {
        email,
        otpCode,
        expiresAt,
      },
    })

    // Send OTP email
    await sendOTPEmail(email, otpCode)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
