import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateJWT } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json()

    // Find OTP verification record
    const otpVerification = await prisma.otpVerification.findFirst({
      where: {
        email,
        otpCode: otp,
        expiresAt: {
          gt: new Date(),
        },
        verified: false,
      },
    })

    if (!otpVerification) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: otpVerification.id },
      data: { verified: true },
    })

    // Update user's email verification status
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Get user data
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Generate JWT token
    const token = generateJWT(user)

    // Set cookie with JWT token
    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return response
  } catch (error) {
    console.error("OTP verification error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
