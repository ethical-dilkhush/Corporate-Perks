"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

interface LoginFormProps {
  role: string
}

export function LoginForm({ role }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (role === "company") {
        // Company login with password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Invalid credentials", {
              description: "Please check your email and password.",
              duration: 3000,
            })
          } else {
            toast.error("Login failed", {
              description: "An error occurred during login. Please try again.",
              duration: 3000,
            })
          }
          return
        }

        if (data?.user) {
          // Verify this is a company account
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('email', email)
            .single()

          if (companyError || !companyData) {
            toast.error("Access Denied", {
              description: "This account is not registered as a company. Please contact support if you think this is a mistake.",
              duration: 3000,
            })
            return
          }

          toast.success("Welcome back!", {
            description: "Successfully logged in to your company account.",
            duration: 3000,
          })

          router.push('/company')
          router.refresh()
        }
      } else {
        // Admin and employee continue with email OTP
        toast.success("Verification email sent", {
          description: "Check your email for the login link.",
          duration: 3000,
        })

        router.push(`/auth/verify-otp?role=${role}`)
      }
    } catch (error) {
      toast.error("Login Error", {
        description: "An unexpected error occurred. Please try again later.",
        duration: 2000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder={role === "admin" ? "admin@company.com" : role === "company" ? "company@domain.com" : "name@company.com"}
            className="pl-8"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>

      {role === "company" && (
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="pl-8"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : role === "company" ? "Sign In" : "Sign In with Email"}
      </Button>
    </form>
  )
}
