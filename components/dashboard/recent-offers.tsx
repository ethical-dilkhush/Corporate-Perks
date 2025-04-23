import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for recent offers
const recentOffers = [
  {
    id: "1",
    title: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    discountValue: 20,
    validUntil: "2025-06-30",
  },
  {
    id: "2",
    title: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    discountValue: 50,
    validUntil: "2025-05-15",
  },
  {
    id: "3",
    title: "15% off Office Supplies",
    company: "OfficeMax",
    discountValue: 15,
    validUntil: "2025-07-01",
  },
]

export function RecentOffers() {
  return (
    <div className="space-y-4">
      {recentOffers.map((offer) => (
        <div key={offer.id} className="flex flex-col space-y-2 rounded-lg border p-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{offer.title}</h3>
              <p className="text-sm text-muted-foreground">{offer.company}</p>
            </div>
            <Badge>{offer.discountValue}% OFF</Badge>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Valid until {new Date(offer.validUntil).toLocaleDateString()}
            </p>
            <Link href={`/dashboard/offers/${offer.id}`}>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
