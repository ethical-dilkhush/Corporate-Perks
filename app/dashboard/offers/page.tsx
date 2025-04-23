"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Tag } from "lucide-react"
import Link from "next/link"

// Mock data for offers
const offers = [
  {
    id: "1",
    title: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    description: "Get 20% off on all electronics and accessories",
    discountValue: 20,
    validUntil: "2025-06-30",
    category: "Electronics",
    image: "/modern-electronics-retail.png",
  },
  {
    id: "2",
    title: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    description: "Enjoy premium coffee at half the price",
    discountValue: 50,
    validUntil: "2025-05-15",
    category: "Food & Beverage",
    image: "/cozy-corner-cafe.png",
  },
  {
    id: "3",
    title: "15% off Office Supplies",
    company: "OfficeMax",
    description: "Save on all office essentials",
    discountValue: 15,
    validUntil: "2025-07-01",
    category: "Office Supplies",
    image: "/placeholder.svg",
  },
]

const categories = ["All", "Electronics", "Food & Beverage", "Office Supplies", "Travel", "Health & Wellness"]

export default function OffersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || offer.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleGenerateCoupon = (offerId: string) => {
    // TODO: Implement coupon generation logic
    console.log("Generating coupon for offer:", offerId)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Available Offers</h1>
        <p className="text-sm text-muted-foreground">Browse and generate coupons for exclusive discounts</p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search offers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={offer.image}
                alt={offer.title}
                className="h-full w-full object-cover"
              />
              <Badge className="absolute right-2 top-2">{offer.category}</Badge>
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{offer.title}</CardTitle>
                  <CardDescription>{offer.company}</CardDescription>
                </div>
                <Badge variant="secondary">{offer.discountValue}% OFF</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{offer.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Valid until {new Date(offer.validUntil).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleGenerateCoupon(offer.id)}>
                Generate Coupon
              </Button>
              <Link href={`/dashboard/offers/${offer.id}`}>
                <Button variant="ghost">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
