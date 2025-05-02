"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, QrCode, Share2 } from "lucide-react"
import { toast } from "sonner"

// Mock data for coupons
const coupons = [
  {
    id: "1",
    offerId: "1",
    code: "TECH20",
    title: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    discountValue: 20,
    validUntil: "2025-06-30",
    status: "active",
    redeemed: false,
  },
  {
    id: "2",
    offerId: "2",
    code: "COFFEE50",
    title: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    discountValue: 50,
    validUntil: "2025-05-15",
    status: "expired",
    redeemed: false,
  },
]

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "expired">("active")

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success("Coupon code copied to clipboard!")
  }

  const handleShare = (code: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Employee Perks Coupon",
        text: `Use this coupon code: ${code}`,
      });
    } else {
      navigator.clipboard.writeText(code);
      toast.success("Coupon code copied to clipboard!");
    }
  }

  const filteredCoupons = coupons.filter(coupon => coupon.status === activeTab)

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">My Coupons</h1>
        <p className="text-sm text-muted-foreground">Manage and redeem your discount coupons</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant={activeTab === "active" ? "default" : "outline"}
          onClick={() => setActiveTab("active")}
        >
          Active
        </Button>
        <Button
          variant={activeTab === "expired" ? "default" : "outline"}
          onClick={() => setActiveTab("expired")}
        >
          Expired
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredCoupons.length > 0 ? (
          filteredCoupons.map((coupon) => (
            <Card key={coupon.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{coupon.title}</CardTitle>
                    <CardDescription>{coupon.company}</CardDescription>
                  </div>
                  <Badge variant="secondary">{coupon.discountValue}% OFF</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                        {coupon.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyCode(coupon.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleShare(coupon.code)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>Valid until {new Date(coupon.validUntil).toLocaleDateString()}</p>
                   
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {activeTab === "active"
                ? "You don't have any active coupons. Browse offers to generate coupons."
                : "No expired coupons to display."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 