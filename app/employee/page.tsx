import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tag, Clock, Building } from "lucide-react"

// In a real app, this would be fetched from an API based on the employee's company
const companyOffers = [
  {
    id: 1,
    title: "20% Off on Electronics",
    company: "TechStore",
    description: "Get 20% off on all electronics purchases",
    validUntil: "2024-12-31",
    category: "Electronics",
  },
  {
    id: 2,
    title: "Corporate Gym Membership",
    company: "FitLife Gym",
    description: "50% discount on annual gym membership",
    validUntil: "2024-12-31",
    category: "Health & Fitness",
  },
  {
    id: 3,
    title: "Food Delivery Discount",
    company: "FoodExpress",
    description: "15% off on all food delivery orders",
    validUntil: "2024-12-31",
    category: "Food & Dining",
  },
]

export default function EmployeeHomePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back!</h1>
          <p className="text-muted-foreground">
            Explore exclusive perks and offers available for your company.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Offers</CardTitle>
              <Tag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companyOffers.length}</div>
              <p className="text-xs text-muted-foreground">Active offers for your company</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Companies offering perks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Offer ending this month</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Latest Offers</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {companyOffers.map((offer) => (
              <Card key={offer.id}>
                <CardHeader>
                  <CardTitle>{offer.title}</CardTitle>
                  <CardDescription>{offer.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{offer.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Valid until {new Date(offer.validUntil).toLocaleDateString()}
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 