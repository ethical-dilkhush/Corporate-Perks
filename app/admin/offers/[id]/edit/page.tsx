"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"

// Mock data for companies
const mockCompanies = [
  { id: "1", name: "TechCorp Inc." },
  { id: "2", name: "Global Solutions" },
  { id: "3", name: "Innovate Labs" },
]

// Mock data for the offer
const mockOffer = {
  id: "1",
  title: "Summer Sale",
  description: "Get 20% off on all products",
  company_id: "1",
  company_name: "TechCorp Inc.",
  discount_percentage: 20,
  start_date: "2024-06-01",
  end_date: "2024-08-31",
  status: "active",
  created_at: "2024-05-15T10:00:00Z"
}

export default function EditOfferPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    company_id: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    status: "active",
  })

  useEffect(() => {
    // TODO: Replace with actual API call to fetch offer
    const fetchOffer = async () => {
      try {
        // const response = await fetch(`/api/offers/${params.id}`)
        // const data = await response.json()
        // setForm(data)
        setForm({
          title: mockOffer.title,
          description: mockOffer.description,
          company_id: mockOffer.company_id,
          discount_percentage: mockOffer.discount_percentage.toString(),
          start_date: mockOffer.start_date,
          end_date: mockOffer.end_date,
          status: mockOffer.status,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch offer details",
          variant: "destructive",
        })
      }
    }

    fetchOffer()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement API call to update offer
      toast({
        title: "Success",
        description: "Offer updated successfully",
      })
      router.push("/admin/offers")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update offer",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Offer</h1>
          <p className="text-muted-foreground">Update offer details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offer Details</CardTitle>
          <CardDescription>
            Update the details of the offer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_id">Company</Label>
                <Select
                  value={form.company_id}
                  onValueChange={(value) => setForm({ ...form, company_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_percentage">Discount Percentage</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount_percentage}
                  onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Offer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 