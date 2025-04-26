"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Tag, Percent, Calendar, Building2 } from "lucide-react"
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

interface Offer {
  id: string
  title: string
  description: string
  company_id: string
  company_name: string
  discount_percentage: number
  start_date: string
  end_date: string
  status: "active" | "inactive" | "expired"
  created_at: string
}

// Mock data for offers
const mockOffers: Offer[] = [
  {
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
  },
  {
    id: "2",
    title: "Back to School",
    description: "Special discounts for students",
    company_id: "2",
    company_name: "Global Solutions",
    discount_percentage: 15,
    start_date: "2024-08-01",
    end_date: "2024-09-30",
    status: "inactive",
    created_at: "2024-05-20T14:30:00Z"
  }
]

// Mock data for offer analytics
const offerAnalytics = {
  totalOffers: 45,
  activeOffers: 30,
  expiredOffers: 10,
  companyOffers: 35,
}

// Mock data for recent offers
const recentOffers = [
  {
    id: "1",
    title: "Summer Sale",
    company_name: "TechCorp Inc.",
    discount_percentage: 20,
    status: "active",
  },
  {
    id: "2",
    title: "Back to School",
    company_name: "Global Solutions",
    discount_percentage: 15,
    status: "inactive",
  },
  {
    id: "3",
    title: "Holiday Special",
    company_name: "Innovate Labs",
    discount_percentage: 25,
    status: "active",
  },
]

export default function AdminOffersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [offers, setOffers] = useState<Offer[]>(mockOffers)
  const [search, setSearch] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<typeof recentOffers[0] | null>(null)

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
    offer.company_name.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  }

  const handleViewDetails = (offer: typeof recentOffers[0]) => {
    setSelectedOffer(offer)
    setShowDetails(true)
  }

  const handleEdit = (offer: typeof recentOffers[0]) => {
    router.push(`/admin/offers/${offer.id}/edit`)
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Offers</h1>
          <p className="text-muted-foreground">Manage and monitor company offers</p>
        </div>
        <Button onClick={() => router.push("/admin/offers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Offer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Analytics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Offer Overview</CardTitle>
              <CardDescription>Current platform statistics</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Offers</p>
                  <p className="text-2xl font-bold">{offerAnalytics.totalOffers}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Percent className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Offers</p>
                  <p className="text-2xl font-bold">{offerAnalytics.activeOffers}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-red-100 rounded-full">
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expired Offers</p>
                  <p className="text-2xl font-bold">{offerAnalytics.expiredOffers}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company Offers</p>
                  <p className="text-2xl font-bold">{offerAnalytics.companyOffers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Offers</CardTitle>
              <CardDescription>Latest offer additions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{offer.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{offer.company_name}</span>
                      <span>{offer.discount_percentage}% off</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      offer.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {offer.status}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(offer)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Offer List or Details */}
        {showDetails && selectedOffer ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedOffer.title}</CardTitle>
                  <CardDescription>Offer Details</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedOffer.company_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedOffer.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discount</p>
                  <p className="font-medium">{selectedOffer.discount_percentage}%</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleEdit(selectedOffer)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Offer
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Offers</CardTitle>
                  <CardDescription>Manage and monitor company offers</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search offers..."
                      className="pl-8"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">{offer.title}</TableCell>
                      <TableCell>{offer.company_name}</TableCell>
                      <TableCell>{offer.discount_percentage}%</TableCell>
                      <TableCell>{formatDate(offer.start_date)}</TableCell>
                      <TableCell>{formatDate(offer.end_date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            offer.status === "active"
                              ? "default"
                              : offer.status === "inactive"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {offer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/offers/${offer.id}/edit`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(offer.id)}
                              className="text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
