"use client"

import { useState, useEffect } from "react"
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
import { supabase } from "@/lib/supabase"

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

// Analytics interface for offers statistics
interface OfferAnalytics {
  totalOffers: number
  activeOffers: number
  expiredOffers: number
  companyOffers: number
}

// Initial state for analytics
const initialAnalytics: OfferAnalytics = {
  totalOffers: 0,
  activeOffers: 0,
  expiredOffers: 0,
  companyOffers: 0
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
  const [offers, setOffers] = useState<Offer[]>([])
  const [search, setSearch] = useState("")
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offerAnalytics, setOfferAnalytics] = useState<OfferAnalytics>(initialAnalytics)
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

  // Fetch data on component mount
  useEffect(() => {
    fetchOffers()
  }, [])

  // Function to fetch offers from Supabase
  const fetchOffers = async () => {
    try {
      setLoading(true)
      
      // Fetch offers data
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select('*, partners(company_name)')
      
      if (offersError) {
        console.error('Error fetching offers:', offersError)
        toast({
          title: "Error",
          description: "Failed to fetch offers data",
          variant: "destructive",
        })
        return
      }

      // Fetch companies data for counting
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id')
      
      if (companiesError) {
        console.error('Error fetching companies:', companiesError)
      }

      // Format offers data
      if (offersData) {
        const formattedOffers: Offer[] = offersData.map(offer => {
          // Determine status based on dates
          const now = new Date()
          const startDate = new Date(offer.start_date)
          const endDate = new Date(offer.end_date)
          
          let status: "Active" | "Expired" | "Pending" = "Active"
          if (now < startDate) {
            status = "Pending"
          } else if (now > endDate) {
            status = "Expired"
          }

          return {
            id: offer.id,
            title: offer.title || "Untitled Offer",
            company: offer.partners?.company_name || offer.partner_id || "Unknown",
            category: offer.category || "General",
            discount: offer.discount_value ? parseFloat(offer.discount_value) : 0,
            status: offer.status || status,
            startDate: offer.start_date || new Date().toISOString(),
            endDate: offer.end_date || new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
            usage: offer.redemptions || 0,
            maxUsage: offer.max_redemptions || 100
          }
        })

        setOffers(formattedOffers)

        // Calculate analytics
        const activeOffers = formattedOffers.filter(offer => offer.status === "Active").length
        const expiredOffers = formattedOffers.filter(offer => offer.status === "Expired").length
        const companies = companiesData?.length || 0

        setOfferAnalytics({
          totalOffers: formattedOffers.length,
          activeOffers,
          expiredOffers,
          companyOffers: companies
        })
      }
    } catch (error) {
      console.error('Error in fetchOffers:', error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      // Update local state
      setOffers(offers.filter(offer => offer.id !== id))
      
      toast({
        title: "Success",
        description: "Offer deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting offer:', error)
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive",
      })
    }
  }

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(search.toLowerCase()) ||
    offer.company.toString().toLowerCase().includes(search.toLowerCase())
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

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Add the offer to Supabase
      const { data, error } = await supabase
        .from('offers')
        .insert([{
          title: form.title,
          partner_id: form.company, // Assuming company is the partner_id
          category: form.category,
          discount_value: form.discount,
          status: form.status,
          start_date: form.startDate,
          end_date: form.endDate,
          max_redemptions: form.maxUsage,
          redemptions: 0,
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) {
        console.error('Error adding offer:', error)
        setFormError('Failed to add offer. Please try again.')
        return
      }

      // Refresh the offers list
      fetchOffers()
      
      // Reset form and show success
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
    } catch (error) {
      console.error('Error in handleAddOffer:', error)
      setFormError('An unexpected error occurred')
    }
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
              <CardTitle>All Offers</CardTitle>
              <CardDescription>Manage and monitor all offers</CardDescription>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search offers..."
                className="pl-8 max-w-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Offer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOffers.length > 0 ? (
                  filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.title}</TableCell>
                      <TableCell>{offer.company}</TableCell>
                      <TableCell>{offer.category}</TableCell>
                      <TableCell>{offer.discount}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            offer.status === "Active" 
                              ? "default" 
                              : offer.status === "Pending" 
                                ? "outline" 
                                : "secondary"
                          }
                        >
                          {offer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {offer.usage} / {offer.maxUsage}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(offer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(offer)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(offer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      No offers found. Try adjusting your search or adding a new offer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Offer Modal */}
      {showViewModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedOffer.title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowViewModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <Badge
                    variant={
                      selectedOffer.status === "Active" 
                        ? "default" 
                        : selectedOffer.status === "Pending" 
                          ? "outline" 
                          : "secondary"
                    }
                  >
                    {selectedOffer.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-medium">{new Date(selectedOffer.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-medium">{new Date(selectedOffer.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usage</p>
                  <p className="font-medium">{selectedOffer.usage} / {selectedOffer.maxUsage}</p>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </Button>
                <Button onClick={() => handleEdit(selectedOffer)}>
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Offer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative border border-border max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold mb-2">Add New Offer</h3>
            <form onSubmit={handleAddOffer} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Offer Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    value={form.discount}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="maxUsage">Max Usage</Label>
                  <Input
                    id="maxUsage"
                    name="maxUsage"
                    type="number"
                    value={form.maxUsage}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add Offer
              </Button>
              {success && <p className="text-green-500 text-sm text-center mt-2">Offer added successfully!</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
