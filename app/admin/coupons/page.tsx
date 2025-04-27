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

// Mock data for coupons
const mockCoupons = [
  {
    id: "1",
    code: "TECH20-ABC123",
    offerTitle: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    user: "john.doe@company.com",
    discountValue: 20,
    createdAt: "2025-01-15",
    redeemedAt: null,
    status: "ACTIVE",
  },
  {
    id: "2",
    code: "COFFEE50-XYZ789",
    offerTitle: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    user: "jane.smith@company.com",
    discountValue: 50,
    createdAt: "2025-01-10",
    redeemedAt: "2025-01-20",
    status: "USED",
  },
]

// Mock data for coupon analytics
const couponAnalytics = {
  totalCoupons: 120,
  activeCoupons: 85,
  usedCoupons: 30,
  expiredCoupons: 5,
}

// Mock data for recent coupons
const recentCoupons = [
  {
    id: "1",
    code: "TECH20-ABC123",
    offerTitle: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    discountValue: 20,
    status: "ACTIVE",
  },
  {
    id: "2",
    code: "COFFEE50-XYZ789",
    offerTitle: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    discountValue: 50,
    status: "USED",
  },
]

export default function AdminCouponsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [coupons, setCoupons] = useState(mockCoupons)
  const [search, setSearch] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<typeof recentCoupons[0] | null>(null)

  const handleDelete = async (id: string) => {
    try {
      // TODO: Implement API call to delete coupon
      setCoupons(coupons.filter(coupon => coupon.id !== id))
      toast({
        title: "Success",
        description: "Coupon deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon",
        variant: "destructive",
      })
    }
  }

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(search.toLowerCase()) ||
    coupon.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleViewDetails = (coupon: typeof recentCoupons[0]) => {
    setSelectedCoupon(coupon)
    setShowDetails(true)
  }

  const handleEdit = (coupon: typeof recentCoupons[0]) => {
    router.push(`/admin/coupons/${coupon.id}/edit`)
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-muted-foreground">Track and manage generated coupons</p>
        </div>
        <Button onClick={() => router.push("/admin/coupons/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Analytics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Overview</CardTitle>
              <CardDescription>Current platform statistics</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Coupons</p>
                  <p className="text-2xl font-bold">{couponAnalytics.totalCoupons}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <Percent className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Coupons</p>
                  <p className="text-2xl font-bold">{couponAnalytics.activeCoupons}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Used Coupons</p>
                  <p className="text-2xl font-bold">{couponAnalytics.usedCoupons}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expired Coupons</p>
                  <p className="text-2xl font-bold">{couponAnalytics.expiredCoupons}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Coupons</CardTitle>
              <CardDescription>Latest coupon additions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCoupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{coupon.code}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{coupon.company}</span>
                      <span>{coupon.discountValue}% off</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      coupon.status === "ACTIVE" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {coupon.status}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(coupon)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Coupon List or Details */}
        {showDetails && selectedCoupon ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedCoupon.code}</CardTitle>
                  <CardDescription>Coupon Details</CardDescription>
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
                  <p className="font-medium">{selectedCoupon.company}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedCoupon.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Discount</p>
                  <p className="font-medium">{selectedCoupon.discountValue}%</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleEdit(selectedCoupon)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Coupon
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Coupons</CardTitle>
                  <CardDescription>Manage coupon codes and settings</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search coupons..."
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
                    <TableHead>Code</TableHead>
                    <TableHead>Offer</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Redeemed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-mono text-sm">{coupon.code}</TableCell>
                      <TableCell>{coupon.offerTitle}</TableCell>
                      <TableCell>{coupon.company}</TableCell>
                      <TableCell>{coupon.user}</TableCell>
                      <TableCell>{new Date(coupon.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{coupon.redeemedAt ? new Date(coupon.redeemedAt).toLocaleDateString() : "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={coupon.status === "ACTIVE" ? "default" : coupon.status === "USED" ? "secondary" : "outline"}
                        >
                          {coupon.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(coupon)}>
                              <Edit className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(coupon.id)}>
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
