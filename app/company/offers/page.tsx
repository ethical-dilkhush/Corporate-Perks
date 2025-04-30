"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Gift,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Users,
  Percent,
  Building2,
  ChevronRight,
  Tag,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"

interface Offer {
  id: string
  title: string
  description: string
  category: string
  discount_type: string
  discount_value: string
  start_date: string
  end_date: string
  status: string
  redemptions: number
  max_redemptions: number
  partner_id: string
  partner_name: string
  image_url: string | null
  created_at: string
  terms: string
}

const categories = [
  "All Categories",
  "Electronics",
  "Fashion & Apparel",
  "Food & Dining",
  "Health & Wellness",
  "Home & Living",
  "Travel & Hospitality",
  "Entertainment",
  "Education",
  "Other",
]

const statuses = ["All Status", "Active", "Ongoing", "Expired"]

export default function OffersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState<Offer | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [updateStatus, setUpdateStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('offers')
        .select(`
          *,
          partners:partner_id (
            company_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const formattedOffers = data.map(offer => ({
        ...offer,
        partner_name: offer.partners?.company_name || 'Unknown Partner',
        status: getOfferStatus(offer.start_date, offer.end_date)
      }))

      setOffers(formattedOffers)
    } catch (error) {
      console.error('Error fetching offers:', error)
      toast({
        title: "Error",
        description: "Failed to fetch offers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getOfferStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return "Ongoing"
    if (now > end) return "Expired"
    return "Active"
  }

  const handleDeleteOffer = async () => {
    if (!offerToDelete) return

    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerToDelete.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Offer deleted successfully",
      })

      setOffers(offers.filter(offer => offer.id !== offerToDelete.id))
      setShowDeleteDialog(false)
      setOfferToDelete(null)
    } catch (error) {
      console.error('Error deleting offer:', error)
      toast({
        title: "Error",
        description: "Failed to delete offer. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditOffer = async (offer: Offer) => {
    try {
      // Fetch the latest offer data before editing
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offer.id)
        .single()

      if (error) throw error

      if (data) {
        setEditingOffer(data)
        setShowEditModal(true)
      }
    } catch (error) {
      console.error('Error fetching offer for edit:', error)
      toast({
        title: "Error",
        description: "Failed to load offer details. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateOffer = async (updatedOffer: Offer) => {
    try {
      // Prepare the data for update
      const updateData = {
        title: updatedOffer.title,
        description: updatedOffer.description,
        category: updatedOffer.category,
        discount_type: updatedOffer.discount_type,
        discount_value: updatedOffer.discount_value,
        start_date: updatedOffer.start_date,
        end_date: updatedOffer.end_date,
        max_redemptions: updatedOffer.max_redemptions,
        terms: updatedOffer.terms,
        redemptions: updatedOffer.redemptions,
        partner_id: updatedOffer.partner_id,
        image_url: updatedOffer.image_url,
      }

      const { data, error } = await supabase
        .from('offers')
        .update(updateData)
        .eq('id', updatedOffer.id)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (data && data.length > 0) {
        // Update the offers list with the new data
        setOffers(offers.map(offer => 
          offer.id === updatedOffer.id ? { ...offer, ...data[0] } : offer
        ))

        // Show success message in the modal
        setUpdateStatus({
          type: 'success',
          message: 'Offer updated successfully!'
        })

        // Don't close the modal automatically
        // Let user close it manually with the Cancel button
      }
    } catch (error) {
      console.error('Error updating offer:', error)
      setUpdateStatus({
        type: 'error',
        message: 'Failed to update offer. Please try again.'
      })
    }
  }

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || offer.category === selectedCategory
    const matchesStatus = selectedStatus === "All Status" || offer.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Employee Offers & Perks
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover and manage exclusive benefits for your employees
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              className="shadow-lg hover:shadow-primary/30 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80"
              onClick={() => router.push("/company/offers/new")}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Offer
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Gift className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{offers.length}</div>
              <p className="text-xs text-muted-foreground">Across all categories</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <Percent className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {offers.filter(o => o.status === "Active").length}
              </div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
              <Building2 className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {new Set(offers.map(o => o.partner_name)).size}
              </div>
              <p className="text-xs text-muted-foreground">Participating companies</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Redemptions</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {offers.reduce((acc, curr) => acc + curr.redemptions, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Benefits claimed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers by title or partner..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Offers Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="relative p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  {offer.image_url ? (
                  <img
                      src={offer.image_url}
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Gift className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge
                    variant={
                      offer.status === "Active"
                        ? "default"
                        : offer.status === "Ongoing"
                        ? "secondary"
                        : "destructive"
                    }
                    className="absolute top-4 right-4"
                  >
                    {offer.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="bg-primary/10">
                    {offer.category}
                  </Badge>
                  <span className="text-2xl font-bold text-primary">
                    {offer.discount_type === "Percentage"
                      ? `${offer.discount_value}%`
                      : `₹${offer.discount_value}`}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {offer.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Partner</span>
                    <span className="font-medium">{offer.partner_name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Valid Until</span>
                    <span className="font-medium">{new Date(offer.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Redemptions</span>
                      <span className="font-medium">{offer.redemptions} / {offer.max_redemptions}</span>
                    </div>
                    <Progress 
                      value={(offer.redemptions / offer.max_redemptions) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex gap-2">
                <Button 
                  className="flex-1 group" 
                  variant="outline"
                  onClick={() => setSelectedOffer(offer)}
                >
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditOffer(offer)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setOfferToDelete(offer)
                    setShowDeleteDialog(true)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Offer Details Dialog */}
      <Dialog open={!!selectedOffer} onOpenChange={() => setSelectedOffer(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedOffer?.title}</DialogTitle>
            <DialogDescription>{selectedOffer?.description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                <p className="text-lg">{selectedOffer?.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Discount</h4>
                <p className="text-lg">
                  {selectedOffer?.discount_type === "Percentage"
                    ? `${selectedOffer?.discount_value}% off`
                    : `₹${selectedOffer?.discount_value} off`}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Partner</h4>
                <p className="text-lg">{selectedOffer?.partner_name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <Badge
                  variant={
                    selectedOffer?.status === "Active"
                      ? "default"
                      : selectedOffer?.status === "Ongoing"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {selectedOffer?.status}
                </Badge>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                <p className="text-lg">{new Date(selectedOffer?.start_date || '').toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
                <p className="text-lg">{new Date(selectedOffer?.end_date || '').toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Redemptions</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Redemptions</span>
                  <span>{selectedOffer?.redemptions} / {selectedOffer?.max_redemptions}</span>
                </div>
                <Progress 
                  value={(selectedOffer?.redemptions || 0) / (selectedOffer?.max_redemptions || 1) * 100} 
                  className="h-2"
                />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Terms & Conditions</h4>
              <p className="text-sm whitespace-pre-wrap">{selectedOffer?.terms}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Offer Modal */}
      <Dialog open={showEditModal} onOpenChange={(open) => {
        if (!open) {
          setShowEditModal(false)
          setEditingOffer(null)
          setUpdateStatus({ type: null, message: '' })
        }
      }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
            <DialogDescription>
              Update the details of your offer
            </DialogDescription>
          </DialogHeader>
          {editingOffer && (
            <div className="space-y-6">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editingOffer.title}
                    onChange={(e) => setEditingOffer({...editingOffer, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={editingOffer.description}
                    onChange={(e) => setEditingOffer({...editingOffer, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={editingOffer.category}
                      onValueChange={(value) => setEditingOffer({...editingOffer, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter(cat => cat !== "All Categories").map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Discount Type</label>
                    <Select
                      value={editingOffer.discount_type}
                      onValueChange={(value) => setEditingOffer({...editingOffer, discount_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Discount Value</label>
                    <Input
                      value={editingOffer.discount_value}
                      onChange={(e) => setEditingOffer({...editingOffer, discount_value: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Redemptions</label>
                    <Input
                      type="number"
                      value={editingOffer.max_redemptions}
                      onChange={(e) => setEditingOffer({...editingOffer, max_redemptions: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      type="date"
                      value={editingOffer.start_date}
                      onChange={(e) => setEditingOffer({...editingOffer, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                      type="date"
                      value={editingOffer.end_date}
                      onChange={(e) => setEditingOffer({...editingOffer, end_date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Terms & Conditions</label>
                  <Textarea
                    value={editingOffer.terms}
                    onChange={(e) => setEditingOffer({...editingOffer, terms: e.target.value})}
                  />
                </div>
              </div>

              {/* Status Message */}
              {updateStatus.type && (
                <div className={`p-4 rounded-lg ${
                  updateStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-red-50 text-red-800'
                }`}>
                  {updateStatus.message}
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingOffer(null)
                    setUpdateStatus({ type: null, message: '' })
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => handleUpdateOffer(editingOffer)}
                >
                  Update Offer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the offer
              "{offerToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOffer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 