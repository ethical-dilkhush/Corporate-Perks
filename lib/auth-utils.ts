// // import type { User } from "@prisma/client"
// // import { sign } from "jsonwebtoken"
// import { Resend } from "resend"

// // Initialize Resend
// const resend = new Resend(process.env.RESEND_API_KEY)

// // Generate a 6-digit OTP
// export function generateOTP(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString()
// }

// // Send OTP email
// export async function sendOTPEmail(email: string, otpCode: string): Promise<void> {
//   try {
//     // In a real implementation, you would use Resend to send the email
//     // await resend.emails.send({
//     //   from: "noreply@corporateperks.com",
//     //   to: email,
//     //   subject: "Your verification code",
//     //   html: `<p>Your verification code is: <strong>${otpCode}</strong></p>`,
//     // })

//     // For development, just log the OTP
//     console.log(`OTP for ${email}: ${otpCode}`)
//   } catch (error) {
//     console.error("Error sending email:", error)
//     throw new Error("Failed to send verification email")
//   }
// }

// // Generate JWT token
// export function generateJWT(user: User | null): string {
//   if (!user) throw new Error("User not found")

//   const secret = process.env.JWT_SECRET || "development-secret"

//   return sign(
//     {
//       id: user.id,
//       email: user.email,
//       role: user.role,
//     },
//     secret,
//     { expiresIn: "15m" }, // 15 minutes
//   )
// }
