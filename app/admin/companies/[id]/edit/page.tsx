"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { use } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for company - in a real app, this would come from an API
const mockCompany = {
  id: "1",
  name: "TechCorp Inc.",
  industry: "Technology",
  address: "123 Tech Street",
  city: "Silicon Valley",
  state: "CA",
  country: "USA",
  postal_code: "94025",
  contact_name: "John Smith",
  contact_email: "john@techcorp.com",
  contact_phone: "+1 234 567 8900",
  website: "https://techcorp.com",
  tax_id: "123456789",
  description: "Leading technology solutions provider",
  status: "approved",
  created_at: "2024-01-01",
  employees: 250,
  deals: 15
}

interface PageProps {
  params: Promise<{ id: string }>
}

interface FormData {
  name: string;
  industry: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  tax_id: string;
  description: string;
  status: string;
  employees?: number;
  deals?: number;
}

export default function EditCompanyPage({ params }: PageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: mockCompany.name,
    industry: mockCompany.industry,
    address: mockCompany.address,
    city: mockCompany.city,
    state: mockCompany.state,
    country: mockCompany.country,
    postal_code: mockCompany.postal_code,
    contact_name: mockCompany.contact_name,
    contact_email: mockCompany.contact_email,
    contact_phone: mockCompany.contact_phone,
    website: mockCompany.website,
    tax_id: mockCompany.tax_id,
    description: mockCompany.description,
    status: mockCompany.status,
    employees: mockCompany.employees,
    deals: mockCompany.deals,
  })

  useEffect(() => {
    // In a real app, you would fetch the company data here
    // const fetchCompany = async () => {
    //   const response = await fetch(`/api/companies/${resolvedParams.id}`)
    //   const data = await response.json()
    //   setFormData(data)
    // }
    // fetchCompany()
  }, [resolvedParams.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Here you would typically make an API call to update the company
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      
      toast({
        title: "Company updated",
        description: "The company details have been updated successfully",
      })
      
      // Redirect back to companies page
      router.push("/admin/companies")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Companies
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Company</h1>
          <p className="text-muted-foreground">Update company information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>
            Update the company information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Input
                  id="employees"
                  name="employees"
                  type="number"
                  value={formData.employees}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_name">Contact Person</Label>
                <Input
                  id="contact_name"
                  name="contact_name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone Number</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 