"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "employee"

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to register the user
      // await fetch("/api/auth/register", { method: "POST", body: JSON.stringify({ email, role }) })
      
      // For demo purposes, we'll just show a success message and redirect
      toast({
        title: "Verification email sent",
        description: "Check your email for the verification link.",
      })

      // Store the role in session storage for the OTP verification
      sessionStorage.setItem("userRole", role)
      
      router.push("/auth/verify-otp")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder={role === "admin" ? "admin@company.com" : role === "company" ? "company@domain.com" : "name@company.com"}
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Sending..." : "Sign Up with Email"}
      </Button>
    </form>
  )
}
