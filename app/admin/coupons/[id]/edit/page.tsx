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

// Mock data for the coupon
const mockCoupon = {
  id: "1",
  code: "SUMMER20",
  description: "20% off on all products",
  company_id: "1",
  company_name: "TechCorp Inc.",
  discount_amount: 20,
  discount_type: "percentage",
  start_date: "2024-06-01",
  end_date: "2024-08-31",
  status: "active",
  usage_limit: 100,
  used_count: 45,
  created_at: "2024-05-15T10:00:00Z"
}

export default function EditCouponPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: "",
    description: "",
    company_id: "",
    discount_amount: "",
    discount_type: "percentage",
    start_date: "",
    end_date: "",
    status: "active",
    usage_limit: "",
  })

  useEffect(() => {
    // TODO: Replace with actual API call to fetch coupon
    const fetchCoupon = async () => {
      try {
        // const response = await fetch(`/api/coupons/${params.id}`)
        // const data = await response.json()
        // setForm(data)
        setForm({
          code: mockCoupon.code,
          description: mockCoupon.description,
          company_id: mockCoupon.company_id,
          discount_amount: mockCoupon.discount_amount.toString(),
          discount_type: mockCoupon.discount_type,
          start_date: mockCoupon.start_date,
          end_date: mockCoupon.end_date,
          status: mockCoupon.status,
          usage_limit: mockCoupon.usage_limit.toString(),
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch coupon details",
          variant: "destructive",
        })
      }
    }

    fetchCoupon()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement API call to update coupon
      toast({
        title: "Success",
        description: "Coupon updated successfully",
      })
      router.push("/admin/coupons")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coupon",
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
          <h1 className="text-3xl font-bold">Edit Coupon</h1>
          <p className="text-muted-foreground">Update coupon details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coupon Details</CardTitle>
          <CardDescription>
            Update the details of the coupon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
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
                <Label htmlFor="discount_type">Discount Type</Label>
                <Select
                  value={form.discount_type}
                  onValueChange={(value) => setForm({ ...form, discount_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount_amount">
                  {form.discount_type === "percentage" ? "Discount Percentage" : "Discount Amount"}
                </Label>
                <Input
                  id="discount_amount"
                  type="number"
                  min="0"
                  max={form.discount_type === "percentage" ? "100" : undefined}
                  value={form.discount_amount}
                  onChange={(e) => setForm({ ...form, discount_amount: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage_limit">Usage Limit</Label>
                <Input
                  id="usage_limit"
                  type="number"
                  min="1"
                  value={form.usage_limit}
                  onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
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
                {loading ? "Updating..." : "Update Coupon"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 