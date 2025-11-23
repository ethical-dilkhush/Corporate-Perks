"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  companyId: z.string().min(1, "Please select a company"),
})

type CompanyOption = {
  id: string
  name: string
  industry: string | null
  website: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
  contact_email: string | null
  contact_phone: string | null
  status: string | null
}

export default function NewPartnerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: "",
    },
  })

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true)
      try {
        const response = await fetch("/api/company/partners")
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result?.error || "Failed to load companies.")
        }

        setCompanies(result.companies || [])
      } catch (error) {
        console.error("Failed to load companies:", error)
        toast({
          title: "Unable to load company details",
          description: error instanceof Error ? error.message : "Please refresh the page or try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCompanies(false)
      }
    }

    fetchCompanies()
  }, [toast])

  const companyOptions = useMemo(() => companies, [companies])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const selectedCompany = companyOptions.find((company) => company.id === values.companyId)

      if (!selectedCompany) {
        throw new Error("Selected company could not be found.")
      }

      if (selectedCompany.status !== "Active") {
        throw new Error("You can only add partners from approved (active) companies.")
      }

      const response = await fetch("/api/company/partners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyId: selectedCompany.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result?.error || "Failed to create partner. Please try again later.")
      }

      toast({
        title: "Partner added",
        description: `${selectedCompany.name} is now available as a partner.`,
      })
      form.reset()
    } catch (error) {
      console.error("Add partner error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add partner.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Partner Company</h1>
          <p className="text-muted-foreground">
            Link an approved company to your partner network.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Select Company</CardTitle>
            <CardDescription>
              Only companies that have been approved by the admin are available here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoadingCompanies || companyOptions.length === 0 || isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isLoadingCompanies
                                  ? "Loading companies..."
                                  : companyOptions.length === 0
                                    ? "No approved companies available"
                                    : "Select company"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {companyOptions.map((company) => (
                            <SelectItem key={company.id} value={company.id}>
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || companyOptions.length === 0}
                >
                  {isSubmitting ? "Adding Partner..." : "Add Partner"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
