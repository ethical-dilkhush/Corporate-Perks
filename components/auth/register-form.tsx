"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobile: z.string().min(10, "Please enter a valid mobile number"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  companyId: z.string().min(1, "Please select your company"),
  role: z.string().min(1, "Please select a role"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

interface RegisterFormProps {
  role: string
}

export function RegisterForm({ role }: RegisterFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([])
  const [companiesLoading, setCompaniesLoading] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      mobile: "",
      role: "Staff",
      companyId: "",
    },
  })

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .eq('status', 'Active')
          .order('name', { ascending: true })

        if (error) {
          throw error
        }

        setCompanies(data || [])
      } catch (error) {
        console.error('Failed to load companies:', error)
        toast({
          title: "Unable to load companies",
          description: "Please refresh the page or try again later.",
          variant: "destructive",
        })
      } finally {
        setCompaniesLoading(false)
      }
    }

    fetchCompanies()
  }, [toast])

  const handleEmployeeSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      // Create auth user first
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
            role: values.role,
            status: 'pending'
          }
        }
      })

      if (signUpError) {
        if (signUpError.message.includes('rate limit')) {
          toast({
            title: "Please wait before trying again",
            description: "For security purposes, you can only request registration once every 24 seconds. Please try again in a moment.",
            variant: "destructive",
          })
          return
        }
        if (signUpError.message.includes('Email address')) {
          toast({
            title: "Invalid Email Address",
            description: "Please enter a valid company email address. Personal email addresses are not allowed.",
            variant: "destructive",
          })
          return
        }
        toast({
          title: "Registration Failed",
          description: signUpError.message || "An error occurred during registration",
          variant: "destructive",
        })
        return
      }

      if (!user) {
        toast({
          title: "Registration Failed",
          description: "User creation failed. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Store registration data
      const { error: insertError } = await supabase
        .from('pending_employee_registrations')
        .insert({
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          role: values.role,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          postal_code: values.postalCode,
          password_hash: values.password,
          company_id: values.companyId,
          status: 'pending'
        })

      if (insertError) {
        if (insertError.code === '23505') { // PostgreSQL unique violation error code
          toast({
            title: "Email already registered",
            description: "This email address is already registered. Please use a different email or contact your company administrator.",
            variant: "destructive",
          })
          return
        }
        toast({
          title: "Registration Failed",
          description: insertError.message || "An error occurred while saving your registration",
          variant: "destructive",
        })
        return
      }

      // Redirect to employee confirmation page
      router.push("/auth/register/employee-confirmation")
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during registration'
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (role === "employee") {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmployeeSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information Column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-medium">Personal Information</h2>
                  <p className="text-xs text-muted-foreground">Provide your personal details.</p>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Company Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@company.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Company Information Column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-medium">Company Information</h2>
                  <p className="text-xs text-muted-foreground">Select the company you belong to.</p>
                </div>
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Company</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={companiesLoading || isLoading || companies.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={companiesLoading ? "Loading companies..." : "Select company"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {(!companiesLoading && companies.length === 0) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          No approved companies available yet. Please try again later.
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Role</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Manager">Manager</SelectItem>
                            <SelectItem value="Staff">Staff</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-medium">Address Information</h2>
                <p className="text-xs text-muted-foreground">Provide your complete address.</p>
              </div>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your complete address"
                        className="min-h-[80px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="NY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Country</FormLabel>
                      <FormControl>
                        <Input placeholder="United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="10001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Password Information */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-medium">Password Information</h2>
                <p className="text-xs text-muted-foreground">Create a secure password for your account.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Confirm your password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                className="w-full max-w-xs"
                disabled={isLoading || companiesLoading || companies.length === 0}
              >
                {isLoading ? "Submitting..." : "Submit Registration"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  // Admin/Company fallback (original form)
  if (role === "company") {
    const companyFormSchema = z.object({
      name: z.string().min(2, "Company name must be at least 2 characters"),
      email: z.string().email("Please enter a valid email address"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Please confirm your password"),
      address: z.string().min(5, "Address must be at least 5 characters"),
      city: z.string().min(2, "City is required"),
      state: z.string().min(2, "State/Province is required"),
      country: z.string().min(2, "Country is required"),
      postalCode: z.string().min(3, "Postal code is required"),
      industry: z.string().min(2, "Industry is required"),
      size: z.string().min(1, "Company size is required"),
    }).refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })

    const companyForm = useForm<z.infer<typeof companyFormSchema>>({
      resolver: zodResolver(companyFormSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        industry: "",
        size: "",
      },
    })

    const handleCompanySubmit = async (values: z.infer<typeof companyFormSchema>) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Registration submitted",
          description: "Your company registration has been submitted.",
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

    return (
      <div className="w-full p-4 bg-white rounded-lg shadow border">
        <Form {...companyForm}>
          <form onSubmit={companyForm.handleSubmit(handleCompanySubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Information Column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-medium">Company Information</h2>
                  <p className="text-xs text-muted-foreground">Provide your company details.</p>
                </div>
                <FormField
                  control={companyForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Company Email</FormLabel>
                      <FormControl>
                        <Input placeholder="company@domain.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Technology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Company Size</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501+">501+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address Information Column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-medium">Address Information</h2>
                  <p className="text-xs text-muted-foreground">Provide your company address.</p>
                </div>
                <FormField
                  control={companyForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your company address"
                          className="min-h-[80px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={companyForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">City</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={companyForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={companyForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Country</FormLabel>
                        <FormControl>
                          <Input placeholder="United States" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={companyForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium">Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
        </div>
        </div>
        </div>

            {/* Password Information */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-medium">Password Information</h2>
                <p className="text-xs text-muted-foreground">Create a secure password for your account.</p>
        </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={companyForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={companyForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium">Confirm Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Confirm your password" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        </div>
        </div>

            <div className="flex justify-center">
              <Button type="submit" className="w-full max-w-xs" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Sign Up"}
        </Button>
            </div>
      </form>
        </Form>
      </div>
    )
  }

  // Admin fallback (original form)
  const [email, setEmail] = useState("")
  const handleAdminSubmit = async (e: React.FormEvent) => {
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
    <form onSubmit={handleAdminSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="admin@company.com"
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
