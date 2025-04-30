"use client"

import { useState, useEffect } from "react"
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

// Define interface for generated coupon data (returned by API)
interface GeneratedCoupon {
  id: string;
  code: string;
  employee_id: number;
  offer_id: string | number; // Can be UUID or INT based on migration
  status: string;
  created_at: string;
  valid_until: string;
  used_at: string | null;
  // We might need offer details here, assuming API returns them or we fetch separately
  offer?: Offer; // Add offer details if returned by API or fetched
}

// Categories for filter
const categories = ["All", "Electronics", "Food & Beverage", "Office Supplies", "Travel", "Health & Wellness"]

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)
  const [generatingCoupon, setGeneratingCoupon] = useState<string | null>(null)
  
  // State for the coupon modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedCouponDetails, setGeneratedCouponDetails] = useState<GeneratedCoupon | null>(null);
  const [couponOfferDetails, setCouponOfferDetails] = useState<Offer | null>(null);
  const [copied, setCopied] = useState(false);

  // Refined date formatting function
  const formatOfferDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      // console.log("Date string is null or undefined"); // Optional: Log if date is missing
      return 'No expiration date';
    }
    try {
      const date = new Date(dateString);
      // Check if the date object is valid
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

  // Filter offers based on search query and category
  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.company_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "All" || offer.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy code');
    });
  };

  const handleGenerateCoupon = async (offerId: string) => {
    try {
      setGeneratingCoupon(offerId)
      
      console.log("[Frontend] Generating coupon for offer ID:", offerId, "Type:", typeof offerId);
      
      // Call the API to generate a coupon
      const response = await fetch('/api/coupons/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ offer_id: offerId })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        if (response.status === 409) {
          // User already has a coupon for this offer
          toast.info('You already have an active coupon for this offer', {
            description: 'Check your coupons page to view it',
            action: {
              label: 'View Coupons',
              onClick: () => window.location.href = '/employee/dashboard/coupons'
            }
          })
        } else {
          throw new Error(data.error || 'Failed to generate coupon')
        }
      } else {
        // Successfully generated a coupon
        // Find the corresponding offer details from the state
        const offerDetails = offers.find(o => o.id === offerId);
        setGeneratedCouponDetails(data.coupon); // Store coupon data from API response
        setCouponOfferDetails(offerDetails || null); // Store offer details
        setIsModalOpen(true); // Open the modal
        toast.success('Coupon generated!'); // Optional: Simple success toast
      }
      
    } catch (error) {
      console.error('Error generating coupon:', error)
      toast.error('Failed to generate coupon. Please try again.')
    } finally {
      setGeneratingCoupon(null)
    }
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
                  onClick={() => handleGenerateCoupon(offer.id)}
                  disabled={generatingCoupon === offer.id}
                >
                  {generatingCoupon === offer.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Coupon'
                  )}
                </Button>
                {/* Link removed as View Details might be less relevant now */}
                {/* <Link href={`/employee/dashboard/offers/${offer.id}`}> */}
                {/*   <Button variant="ghost">View Details</Button> */}
                {/* </Link> */}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Coupon Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Coupon Generated Successfully!</DialogTitle>
            <DialogDescription>
              Your unique coupon code is ready. Keep it safe!
            </DialogDescription>
          </DialogHeader>
          {generatedCouponDetails && couponOfferDetails && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg bg-muted/50">
                <span className="text-sm font-semibold text-muted-foreground mb-1">Your Coupon Code:</span>
                <div className="flex items-center gap-2">
                  <code className="text-2xl font-bold tracking-wider text-primary">
                    {generatedCouponDetails.code}
                  </code>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(generatedCouponDetails.code)}
                    aria-label="Copy coupon code"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Offer:</strong> {couponOfferDetails.title}</p>
                <p><strong>Company:</strong> {couponOfferDetails.company_name}</p>
                <p><strong>Discount:</strong> {couponOfferDetails.discount_value}% OFF</p>
                <p><strong>Expires on:</strong> {formatOfferDate(generatedCouponDetails.valid_until)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="outline">Close</Button>
            <Button onClick={() => window.location.href = '/employee/dashboard/coupons'}>View All Coupons</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
} 