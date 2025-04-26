"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select } from "@/components/ui/select"

interface RegisterFormProps {
  role: string
}

export function RegisterForm({ role }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Employee form state
  const [employeeData, setEmployeeData] = useState({
    name: "",
    mobile: "",
    email: "",
    companyName: "",
    role: "Manager",
    status: "Active",
  })

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEmployeeData({ ...employeeData, [e.target.name]: e.target.value })
  }

  const handleEmployeeSelect = (name: string, value: string) => {
    setEmployeeData({ ...employeeData, [name]: value })
  }

  const onEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Registration submitted",
        description: "Your employee registration has been submitted.",
      })
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

  if (role === "employee") {
    return (
      <form onSubmit={onEmployeeSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Full Name" value={employeeData.name} onChange={handleEmployeeChange} required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile</Label>
          <Input id="mobile" name="mobile" placeholder="Mobile Number" value={employeeData.mobile} onChange={handleEmployeeChange} required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Company Email</Label>
          <Input id="email" name="email" placeholder="name@company.com" type="email" value={employeeData.email} onChange={handleEmployeeChange} required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input id="companyName" name="companyName" placeholder="Company Name" value={employeeData.companyName} onChange={handleEmployeeChange} required disabled={isLoading} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <select id="role" name="role" className="w-full border rounded px-2 py-2" value={employeeData.role} onChange={handleEmployeeChange} disabled={isLoading} required>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="HR">HR</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" className="w-full border rounded px-2 py-2" value={employeeData.status} onChange={handleEmployeeChange} disabled={isLoading} required>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Sign Up"}
        </Button>
      </form>
    )
  }

  // Admin/Company fallback (original form)
  const [email, setEmail] = useState("")
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      toast({
        title: "Verification email sent",
        description: "Check your email for the verification link.",
      })
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
