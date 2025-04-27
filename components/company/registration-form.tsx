"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

const formSchema = z.object({
  // Company Information
  name: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Please select an industry"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State/Province is required"),
  country: z.string().min(2, "Country is required"),
  postalCode: z.string().min(3, "Postal code is required"),

  // Contact Information
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  contactEmail: z.string().email("Please enter a valid email address"),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
  website: z.string().url("Please enter a valid website URL"),

  // Additional Details
  taxId: z.string().min(5, "Tax ID/VAT Number is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
})

export function CompanyRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      industry: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      taxId: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("companies").insert([
        {
          name: values.name,
          industry: values.industry,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          postal_code: values.postalCode,
          contact_name: values.contactName,
          contact_email: values.contactEmail,
          contact_phone: values.contactPhone,
          website: values.website,
          tax_id: values.taxId,
          description: values.description,
          status: "pending",
        },
      ])

      if (error) throw error

      toast({
        title: "Registration submitted",
        description: "Your company registration has been submitted for approval",
      })

      router.push("/company/registration-confirmation")
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Company Information Column */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-medium">Company Information</h2>
                <p className="text-xs text-muted-foreground">Provide details about your company to get started.</p>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Company Name</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Industry</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="Technology" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Company Address</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="123 Business Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">City</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="New York" {...field} />
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
                      <Input className="w-full" placeholder="NY" {...field} />
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
                      <Input className="w-full" placeholder="United States" {...field} />
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
                      <Input className="w-full" placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information Column */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-medium">Contact Information</h2>
                <p className="text-xs text-muted-foreground">Provide contact details for the person managing this account.</p>
              </div>
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Contact Person Name</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Contact Email</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">This email will be used for account verification and communication.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Contact Phone Number</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Website URL</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="https://www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Additional Details Column */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-medium">Additional Details</h2>
                <p className="text-xs text-muted-foreground">Provide additional information about your company.</p>
              </div>
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Tax ID/VAT Number</FormLabel>
                    <FormControl>
                      <Input className="w-full" placeholder="123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">Company Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full min-h-[120px]"
                        placeholder="Briefly describe your company and the types of offers you'd like to provide"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button type="submit" className="w-full max-w-xs" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Registration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
