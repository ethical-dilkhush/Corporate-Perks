"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Tag, Loader2, Copy, Check, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Define interface for offer data
interface Offer {
  id: string;
  title: string;
  company_name: string;
  description: string;
  discount_value: number;
  valid_until: string;
  end_date?: string | null;
  category: string;
  image_url: string;
  validUntilFormatted?: string | null;
}

// Categories for filter
const categories = ["All", "Electronics", "Food & Beverage", "Office Supplies", "Travel", "Health & Wellness"]

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [generatingOfferId, setGeneratingOfferId] = useState<string | null>(null)
  const loggedImpressionsRef = useRef<Set<string>>(new Set())
  
  // Refined date formatting function
  const formatOfferDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
   
      return 'No expiration date';
    }
    try {
      const date = new Date(dateString);

   
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date string encountered: ${dateString}`); // Log the invalid string
        return 'Invalid expiration date';
      }
      // Format the valid date
      return date.toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
      });
    


    } catch (error) {
      console.error(`Error formatting date string: ${dateString}`, error);
      return "Date formatting error"; // Indicate an error during formatting
    }
  };

  const logOfferEvent = async (offerId: string, eventType: "impression" | "click") => {
    try {
      await fetch("/api/offer-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId,
          eventType,
        }),
      })
    } catch (error) {
      console.error("Failed to log offer event:", error)
    }
  }

  const handleGenerateCoupon = async (offer: Offer) => {
    if (generatingOfferId) return
    setGeneratingOfferId(offer.id)
    try {
      await logOfferEvent(offer.id, "click")

      const response = await fetch("/api/coupons/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offer_id: offer.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate coupon")
      }

      toast.success("Coupon generated successfully", {
        description: data?.coupon?.code
          ? `Use code ${data.coupon.code} before ${data.coupon.valid_until ? new Date(data.coupon.valid_until).toLocaleDateString() : "expiry"}`
          : "You can now redeem this offer.",
      })
    } catch (error) {
      console.error("Generate coupon error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate coupon")
    } finally {
      setGeneratingOfferId(null)
    }
  }

  // Fetch offers from the API - Keep raw data
  useEffect(() => {
    async function fetchOffers() {
      try {
        setLoading(true)
        const response = await fetch('/api/offers');
        if (!response.ok) {
          throw new Error('Failed to fetch offers')
        }
        const data = await response.json()
        setOffers(data); // Store raw data
      } catch (error) {
        console.error('Error fetching offers:', error);
        toast.error('Failed to load offers. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchOffers()
  }, [])

  useEffect(() => {
    offers.forEach((offer) => {
      if (!loggedImpressionsRef.current.has(offer.id)) {
        logOfferEvent(offer.id, "impression")
        loggedImpressionsRef.current.add(offer.id)
      }
    })
  }, [offers])

  // Filter offers based on search query and category
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || offer.category === selectedCategory
    return matchesSearch && matchesCategory

  })


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

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading offers...</span>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium">No offers found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden flex flex-col">
              <div className="relative h-48 w-full">
                <img
                  src={offer.image_url || '/placeholder.svg'}
                  alt={offer.title}
                  className="h-full w-full object-cover"
                />
                <Badge className="absolute right-2 top-2">{offer.category}</Badge>
              </div>
              <CardHeader className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{offer.title}</CardTitle>
                    <CardDescription>{offer.company_name}</CardDescription>
                  </div>
                  <Badge variant="secondary">{offer.discount_value}% OFF</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-2">{offer.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Valid until {formatOfferDate(offer.end_date)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between mt-auto pt-4">

              <Button
                onClick={() => handleGenerateCoupon(offer)}
                disabled={generatingOfferId === offer.id}
              >
                {generatingOfferId === offer.id ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </span>
                ) : (
                  "Generate Coupon"
                )}
              </Button>
                  
      
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 