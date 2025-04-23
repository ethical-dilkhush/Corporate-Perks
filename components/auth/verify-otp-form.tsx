"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function VerifyOtpForm() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to verify the OTP
      // await fetch("/api/auth/verify", { method: "POST", body: JSON.stringify({ otp }) })

      // Get the user role from session storage
      const role = sessionStorage.getItem("userRole") || "employee"

      // Clear the role from session storage
      sessionStorage.removeItem("userRole")

      // Show success message
      toast({
        title: "Success",
        description: "You have been successfully logged in.",
      })

      // Redirect based on role
      switch (role) {
        case "admin":
          router.push("/admin/dashboard")
          break
        case "company":
          router.push("/company/dashboard")
          break
        default:
          router.push("/dashboard")
          break
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Verification Code</Label>
        <Input
          id="otp"
          placeholder="123456"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoComplete="one-time-code"
          disabled={isLoading}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>
    </form>
  )
}
