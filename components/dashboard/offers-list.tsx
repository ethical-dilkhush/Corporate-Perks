"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

// Mock data for offers
const mockOffers = [
  {
    id: "1",
    title: "20% off at TechGadgets",
    description: "Get 20% off on all electronics and gadgets at TechGadgets stores nationwide.",
    company: "TechGadgets Inc.",
    discountValue: 20,
    validFrom: "2025-01-01",
    validUntil: "2025-06-30",
    image: "/modern-electronics-retail.png",
  },
  {
    id: "2",
    title: "50% off Premium Coffee",
    description: "Enjoy 50% off on all premium coffee beverages at BeanBrew Coffee shops.",
    company: "BeanBrew Coffee",
    discountValue: 50,
    validFrom: "2025-01-15",
    validUntil: "2025-05-15",
    image: "/cozy-corner-cafe.png",
  },
  {
    id: "3",
    title: "15% off Office Supplies",
    description: "Save 15% on all office supplies and furniture at OfficeMax stores.",
    company: "OfficeMax",
    discountValue: 15,
    validFrom: "2025-02-01",
    validUntil: "2025-07-01",
    image: "/organized-desk-essentials.png",
  },
  {
    id: "4",
    title: "30% off Fitness Membership",
    description: "Get 30% off on annual fitness membership at FitLife gyms.",
    company: "FitLife Gyms",
    discountValue: 30,
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    image: "/vibrant-gym-workout.png",
  },
  {
    id: "5",
    title: "25% off Business Travel",
    description: "Save 25% on business travel bookings through TravelPro agency.",
    company: "TravelPro",
    discountValue: 25,
    validFrom: "2025-01-01",
    validUntil: "2025-08-31",
    image: "/airport-departure.png",
  },
  {
    id: "6",
    title: "10% off Professional Development",
    description: "Get 10% off on all professional development courses and certifications.",
    company: "LearnPro Academy",
    discountValue: 10,
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    image: "/placeholder.svg?height=200&width=400&query=professional%20development",
  },
]

export function OffersList() {
  const [offers] = useState(mockOffers)
  const { toast } = useToast()

  const handleGenerateCoupon = (offerId: string) => {
    // In a real implementation, this would call your API
    // const response = await fetch(`/api/coupons/generate`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ offerId }),
    // })

    toast({
      title: "Coupon Generated",
      description: "Your coupon has been generated successfully",
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {offers.map((offer) => (
        <Card key={offer.id} className="overflow-hidden">
          <img src={offer.image || "/placeholder.svg"} alt={offer.title} className="h-48 w-full object-cover" />
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{offer.title}</CardTitle>
                <CardDescription>{offer.company}</CardDescription>
              </div>
              <Badge>{offer.discountValue}% OFF</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{offer.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Valid until {new Date(offer.validUntil).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => handleGenerateCoupon(offer.id)}>
              Generate Coupon
            </Button>
            <Link href={`/dashboard/offers/${offer.id}`}>
              <Button variant="ghost">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
