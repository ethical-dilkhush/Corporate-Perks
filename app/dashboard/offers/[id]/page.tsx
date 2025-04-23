"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Calendar, Building, Tag } from "lucide-react"

interface Offer {
  id: string
  title: string
  description: string
  discountValue: number
  validFrom: string
  validUntil: string
  company: {
    id: string
    name: string
  }
}

interface Coupon {
  id: string
  code: string
  status: "ACTIVE" | "USED" | "EXPIRED"
  createdAt: string
  redeemedAt: string | null
}

export default function OfferDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        // In a real implementation, this would call your API
        // const response = await fetch(`/api/offers/${params.id}`)
        // const data = await response.json()
        // setOffer(data.offer)
        // setCoupon(data.coupon)

        // Mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setOffer({
          id: params.id as string,
          title: "20% off at TechGadgets",
          description: "Get 20% off on all electronics and gadgets at TechGadgets stores nationwide.",
          discountValue: 20,
          validFrom: "2025-01-01",
          validUntil: "2025-06-30",
          company: {
            id: "1",
            name: "TechGadgets Inc.",
          },
        })
        setCoupon(null)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load offer details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOfferDetails()
  }, [params.id, toast])

  const handleGenerateCoupon = async () => {
    setIsGenerating(true)

    try {
      // In a real implementation, this would call your API
      // const response = await fetch("/api/coupons/generate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ offerId: offer?.id }),
      // })
      // const data = await response.json()
      // setCoupon(data.coupon)

      // Mock data
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCoupon({
        id: "new-coupon-id",
        code: "TECH20-ABC123",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        redeemedAt: null,
      })

      toast({
        title: "Coupon Generated",
        description: "Your coupon has been generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate coupon",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCouponCode = () => {
    if (coupon) {
      navigator.clipboard.writeText(coupon.code)
      toast({
        title: "Code copied",
        description: "Coupon code copied to clipboard",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px] w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold">Offer not found</h2>
        <p className="text-muted-foreground">The offer you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard/offers")}>
          Back to Offers
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{offer.title}</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <img
            src="/modern-electronics-retail.png"
            alt={offer.title}
            className="aspect-video w-full rounded-lg object-cover"
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className="text-lg px-3 py-1">{offer.discountValue}% OFF</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Building className="mr-1 h-4 w-4" />
              {offer.company.name}
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <p>{offer.description}</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                Valid from {new Date(offer.validFrom).toLocaleDateString()} to{" "}
                {new Date(offer.validUntil).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Discount: {offer.discountValue}% off</span>
            </div>
          </div>
          {coupon ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Coupon</CardTitle>
                <CardDescription>Use this code to redeem your discount</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-md bg-muted p-3">
                  <code className="font-mono text-lg">{coupon.code}</code>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Generated on {new Date(coupon.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleCopyCouponCode}>
                  Copy Code
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Button className="w-full" onClick={handleGenerateCoupon} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Coupon"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
