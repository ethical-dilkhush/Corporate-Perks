import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CompanyStats } from "@/components/company/company-stats"
import { CompanyOffers } from "@/components/company/company-offers"

export default function CompanyDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
          <p className="text-muted-foreground">Manage your offers and track performance</p>
        </div>
        <Link href="/company/offers/create">
          <Button>Create New Offer</Button>
        </Link>
      </div>
      <CompanyStats />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Active Offers</CardTitle>
            <CardDescription>Your currently active discount offers</CardDescription>
          </CardHeader>
          <CardContent>
            <CompanyOffers />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest coupon redemptions and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground">
              No recent activity to display.
              <br />
              Create offers to start generating coupons.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
