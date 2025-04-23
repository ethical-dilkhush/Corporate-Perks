import { VerifyOtpForm } from "@/components/auth/verify-otp-form"

export default function VerifyOtpPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
          <p className="text-sm text-muted-foreground">Enter the verification code sent to your email</p>
        </div>
        <VerifyOtpForm />
      </div>
    </div>
  )
}
