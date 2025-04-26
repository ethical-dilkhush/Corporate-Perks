import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentOffers } from "@/components/dashboard/recent-offers"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, John Doe! Here's an overview of your perks.</p>
      </div>
      <div className="grid gap-4 md:gap-6">
        <DashboardStats />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Offers</CardTitle>
              <CardDescription>Latest discounts available for you</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentOffers />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Coupons</CardTitle>
              <CardDescription>Your currently active discount coupons</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                You don't have any active coupons yet.
                <br />
                Browse offers to generate coupons.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
