import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for company offers
const companyOffers = [
  {
    id: "1",
    title: "20% off at TechGadgets",
    discountValue: 20,
    validUntil: "2025-06-30",
    couponsGenerated: 45,
    couponsRedeemed: 32,
  },
  {
    id: "2",
    title: "Summer Special: 25% off Electronics",
    discountValue: 25,
    validUntil: "2025-08-31",
    couponsGenerated: 38,
    couponsRedeemed: 24,
  },
  {
    id: "3",
    title: "Holiday Bundle: 30% off",
    discountValue: 30,
    validUntil: "2025-12-31",
    couponsGenerated: 27,
    couponsRedeemed: 18,
  },
]

export function CompanyOffers() {
  return (
    <div className="space-y-4">
      {companyOffers.map((offer) => (
        <div key={offer.id} className="flex flex-col space-y-2 rounded-lg border p-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{offer.title}</h3>
              <p className="text-sm text-muted-foreground">
                {offer.couponsRedeemed}/{offer.couponsGenerated} coupons redeemed
              </p>
            </div>
            <Badge>{offer.discountValue}% OFF</Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Valid until {new Date(offer.validUntil).toLocaleDateString()}
            </p>
            <Link href={`/company/offers/${offer.id}`}>
              <Button size="sm" variant="outline">
                Manage
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
