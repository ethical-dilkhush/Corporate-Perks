import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateOTP, sendOTPEmail } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json({ error: "User already exists. Please login instead." }, { status: 400 })
      }
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          email,
          name,
          role: "EMPLOYEE",
        },
      })
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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
