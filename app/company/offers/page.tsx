"use client"

import { useState } from "react"
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

// Mock data - in a real app, this would come from an API
const offers = [
  {
    id: 1,
    title: "Summer Electronics Sale",
    category: "Electronics",
    discountType: "Percentage",
    discountValue: "20%",
    validUntil: "2024-08-31",
    status: "Active",
    redemptions: 145,
    maxRedemptions: 200,
    partner: "TechStore",
    description: "Get amazing discounts on the latest electronics and gadgets.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Fitness Membership Discount",
    category: "Health & Wellness",
    discountType: "Fixed",
    discountValue: "₹2000",
    validUntil: "2024-12-31",
    status: "Active",
    redemptions: 89,
    maxRedemptions: 150,
    partner: "FitLife Gym",
    description: "Stay fit with exclusive membership discounts at premium gyms.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Food Delivery Offer",
    category: "Food & Dining",
    discountType: "Percentage",
    discountValue: "15%",
    validUntil: "2024-06-30",
    status: "Active",
    redemptions: 267,
    maxRedemptions: 300,
    partner: "FoodExpress",
    description: "Enjoy delicious meals with special discounts on food delivery.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Movie Tickets Discount",
    category: "Entertainment",
    discountType: "Fixed",
    discountValue: "₹200",
    validUntil: "2024-07-15",
    status: "Upcoming",
    redemptions: 0,
    maxRedemptions: 500,
    partner: "CineMax",
    description: "Watch the latest movies at discounted prices.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=300&fit=crop",
  },
]

const categories = [
  "All Categories",
  "Electronics",
  "Health & Wellness",
  "Food & Dining",
  "Entertainment",
  "Fashion",
  "Travel",
  "Education",
]

const statuses = ["All Status", "Active", "Upcoming", "Expired"]

export default function OffersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.partner.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || offer.category === selectedCategory
    const matchesStatus = selectedStatus === "All Status" || offer.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

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
                {new Set(offers.map(o => o.partner)).size}
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
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="w-10 h-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
              </svg>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="w-10 h-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Offers Grid/List */}
        <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="relative p-0">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Badge
                    variant={
                      offer.status === "Active"
                        ? "default"
                        : offer.status === "Upcoming"
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
                    {offer.discountValue}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {offer.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Partner</span>
                    <span className="font-medium">{offer.partner}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Valid Until</span>
                    <span className="font-medium">{offer.validUntil}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Redemptions</span>
                      <span className="font-medium">{offer.redemptions} / {offer.maxRedemptions}</span>
                    </div>
                    <Progress 
                      value={(offer.redemptions / offer.maxRedemptions) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button className="w-full group" variant="outline">
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 