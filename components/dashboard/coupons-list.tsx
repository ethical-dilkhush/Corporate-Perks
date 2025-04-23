"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Copy, ExternalLink } from "lucide-react"

// Mock data for coupons
const mockCoupons = {
  active: [
    {
      id: "1",
      code: "TECH20-ABC123",
      offerTitle: "20% off at TechGadgets",
      company: "TechGadgets Inc.",
      discountValue: 20,
      validUntil: "2025-06-30",
      createdAt: "2025-01-15",
    },
  ],
  used: [
    {
      id: "2",
      code: "COFFEE50-XYZ789",
      offerTitle: "50% off Premium Coffee",
      company: "BeanBrew Coffee",
      discountValue: 50,
      validUntil: "2025-05-15",
      createdAt: "2025-01-10",
      redeemedAt: "2025-01-20",
    },
  ],
  expired: [
    {
      id: "3",
      code: "OFFICE15-DEF456",
      offerTitle: "15% off Office Supplies",
      company: "OfficeMax",
      discountValue: 15,
      validUntil: "2024-12-31",
      createdAt: "2024-11-15",
    },
  ],
}

interface CouponsListProps {
  status: "active" | "used" | "expired"
}

export function CouponsList({ status }: CouponsListProps) {
  const [coupons] = useState(mockCoupons[status])
  const { toast } = useToast()

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied",
      description: "Coupon code copied to clipboard",
    })
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {status === "active" && "You don't have any active coupons. Browse offers to generate coupons."}
        {status === "used" && "You haven't used any coupons yet."}
        {status === "expired" && "You don't have any expired coupons."}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {coupons.map((coupon) => (
        <Card key={coupon.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{coupon.offerTitle}</CardTitle>
              <Badge>{coupon.discountValue}% OFF</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{coupon.company}</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-md bg-muted p-3">
              <code className="font-mono text-sm">{coupon.code}</code>
              <Button variant="ghost" size="icon" onClick={() => handleCopyCode(coupon.code)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              {status === "active" && <p>Valid until {new Date(coupon.validUntil).toLocaleDateString()}</p>}
              {status === "used" && <p>Redeemed on {new Date(coupon.redeemedAt!).toLocaleDateString()}</p>}
              {status === "expired" && <p>Expired on {new Date(coupon.validUntil).toLocaleDateString()}</p>}
              <p>Created on {new Date(coupon.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
          <CardFooter>
            {status === "active" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">View Coupon</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{coupon.offerTitle}</DialogTitle>
                    <DialogDescription>{coupon.company}</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col items-center gap-4 py-4">
                    <Badge className="text-lg px-3 py-1">{coupon.discountValue}% OFF</Badge>
                    <div className="flex items-center justify-center rounded-md bg-muted p-6 w-full">
                      <code className="font-mono text-xl">{coupon.code}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Valid until {new Date(coupon.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="sm:flex-1" onClick={() => handleCopyCode(coupon.code)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Code
                    </Button>
                    <Button className="sm:flex-1">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Redeem Online
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            {(status === "used" || status === "expired") && (
              <Button variant="outline" className="w-full" disabled>
                {status === "used" ? "Already Redeemed" : "Expired"}
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
