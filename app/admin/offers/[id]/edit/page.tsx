"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { ArrowLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Offer {
  id: string
  title: string
  company: string
  category: string
  discount: number
  status: "Active" | "Expired" | "Pending"
  startDate: string
  endDate: string
  usage: number
  maxUsage: number
}

interface OfferForm {
  title: string
  company: string
  category: string
  discount: string
  status: "Active" | "Expired" | "Pending"
  startDate: string
  endDate: string
  maxUsage: string
}

export default function EditOfferPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [form, setForm] = useState<OfferForm>({
    title: "",
    company: "",
    category: "",
    discount: "",
    status: "Active",
    startDate: "",
    endDate: "",
    maxUsage: ""
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        // TODO: Replace with actual API call
        const mockOffer: Offer = {
          id: params.id,
          title: "Premium Software Suite",
          company: "TechGadgets Inc.",
          category: "Software",
          discount: 20,
          status: "Active",
          startDate: "2024-01-01",
          endDate: "2024-12-31",
          usage: 45,
          maxUsage: 100
        }
        setOffer(mockOffer)
        setForm({
          title: mockOffer.title,
          company: mockOffer.company,
          category: mockOffer.category,
          discount: mockOffer.discount.toString(),
          status: mockOffer.status,
          startDate: mockOffer.startDate,
          endDate: mockOffer.endDate,
          maxUsage: mockOffer.maxUsage.toString()
        })
      } catch (err) {
        setError("Failed to load offer")
        toast({
          title: "Error",
          description: "Failed to load offer details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [params.id, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Implement API call to update offer
      toast({
        title: "Success",
        description: "Offer updated successfully",
      })
      router.push("/admin/offers")
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update offer",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Offer</h2>
            <p className="text-muted-foreground">Update offer details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Offer Title</Label>
            <Input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Discount (%)</Label>
            <Input
              id="discount"
              name="discount"
              type="number"
              min="0"
              max="100"
              value={form.discount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              name="endDate"
              type="date"
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxUsage">Maximum Usage</Label>
            <Input
              id="maxUsage"
              name="maxUsage"
              type="number"
              min="0"
              value={form.maxUsage}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "Active" | "Expired" | "Pending" })}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
} 