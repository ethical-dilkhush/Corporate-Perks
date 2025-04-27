"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Tag, Percent, Calendar, Building2, Edit2, Trash2, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { formatNumber } from "@/lib/utils"

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

// Mock data for offers
const mockOffers: Offer[] = [
  {
    id: "1",
    title: "Summer Sale",
    company: "TechCorp Inc.",
    category: "Retail",
    discount: 20,
    status: "Active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    usage: 45,
    maxUsage: 100
  },
  {
    id: "2",
    title: "Back to School",
    company: "Global Solutions",
    category: "Education",
    discount: 15,
    status: "Pending",
    startDate: "2024-08-01",
    endDate: "2024-09-30",
    usage: 30,
    maxUsage: 50
  }
]

// Mock data for offer analytics
const offerAnalytics = {
  totalOffers: 45,
  activeOffers: 30,
  expiredOffers: 10,
  companyOffers: 35,
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

export default function AdminOffersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [offers, setOffers] = useState<Offer[]>(mockOffers)
  const [search, setSearch] = useState("")
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
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
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState('')

  const handleDelete = async (id: string) => {
    try {
      // TODO: Implement API call to delete offer
      setOffers(offers.filter(offer => offer.id !== id))
      toast({
        title: "Success",
        description: "Offer deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive",
      })
    }
  }

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(search.toLowerCase()) ||
    offer.company.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const handleViewDetails = (offer: Offer) => {
    setSelectedOffer(offer)
    setShowViewModal(true)
  }

  const handleEdit = (offer: Offer) => {
    router.push(`/admin/offers/${offer.id}/edit`)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault()
    const newOffer: Offer = {
      id: String(offers.length + 1),
      title: form.title,
      company: form.company,
      category: form.category,
      discount: Number(form.discount),
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      usage: 0,
      maxUsage: Number(form.maxUsage)
    }
    setOffers([...offers, newOffer])
    setForm({
      title: "",
      company: "",
      category: "",
      discount: "",
      status: "Active",
      startDate: "",
      endDate: "",
      maxUsage: ""
    })
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setShowAddModal(false)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Offers</h2>
          <p className="text-muted-foreground">Manage all available offers</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Offer
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="p-2 bg-blue-100 rounded-full">
              <Tag className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Offers</p>
              <p className="text-2xl font-bold">{offerAnalytics.totalOffers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="p-2 bg-green-100 rounded-full">
              <Percent className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Offers</p>
              <p className="text-2xl font-bold">{offerAnalytics.activeOffers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="p-2 bg-red-100 rounded-full">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expired Offers</p>
              <p className="text-2xl font-bold">{offerAnalytics.expiredOffers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="p-2 bg-orange-100 rounded-full">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Company Offers</p>
              <p className="text-2xl font-bold">{offerAnalytics.companyOffers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Offer List</CardTitle>
              <CardDescription>View and manage all available offers</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search offers..."
                className="w-[200px]"
              />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>{offer.title}</TableCell>
                    <TableCell>{offer.company}</TableCell>
                    <TableCell>{offer.category}</TableCell>
                    <TableCell>{offer.discount}%</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        offer.status === "Active" ? "bg-green-100 text-green-800" : 
                        offer.status === "Expired" ? "bg-red-100 text-red-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {offer.status}
                      </span>
                    </TableCell>
                    <TableCell>{offer.usage}/{offer.maxUsage}</TableCell>
                    <TableCell>{formatDate(offer.startDate)}</TableCell>
                    <TableCell>{formatDate(offer.endDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-blue-50"
                          onClick={() => handleViewDetails(offer)}
                        >
                          <Eye className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-green-50"
                          onClick={() => handleEdit(offer)}
                        >
                          <Edit2 className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="hover:bg-red-50"
                          onClick={() => handleDelete(offer.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Offer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative border-2 border-blue-200 animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-blue-600 hover:text-blue-800"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-2 text-blue-700">Add New Offer</h3>
            <form onSubmit={handleAddOffer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Offer Title</Label>
                  <Input id="title" name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" value={form.company} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" value={form.category} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input id="discount" name="discount" type="number" min="0" max="100" value={form.discount} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsage">Maximum Usage</Label>
                  <Input id="maxUsage" name="maxUsage" type="number" min="0" value={form.maxUsage} onChange={handleChange} required />
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
              {formError && <div className="text-red-600 text-center font-medium mt-2">{formError}</div>}
              <Button
                type="submit"
                className="w-full bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white mt-2"
              >
                Add Offer
              </Button>
              {success && <div className="text-green-600 text-center font-medium mt-2">Offer added successfully!</div>}
            </form>
          </div>
        </div>
      )}

      {/* View Offer Modal */}
      {showViewModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Offer Details</h3>
              <Button variant="ghost" onClick={() => setShowViewModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{selectedOffer.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{selectedOffer.company}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{selectedOffer.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discount</p>
                <p className="font-medium">{selectedOffer.discount}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  selectedOffer.status === "Active" ? "bg-green-100 text-green-800" : 
                  selectedOffer.status === "Expired" ? "bg-red-100 text-red-800" : 
                  "bg-yellow-100 text-yellow-800"
                }`}>
                  {selectedOffer.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usage</p>
                <p className="font-medium">{selectedOffer.usage}/{selectedOffer.maxUsage}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="font-medium">{formatDate(selectedOffer.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="font-medium">{formatDate(selectedOffer.endDate)}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button onClick={() => handleEdit(selectedOffer)}>
                Edit Offer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
