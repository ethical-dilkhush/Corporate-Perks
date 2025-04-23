import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentCompanies } from "@/components/admin/recent-companies"
import { RecentOffers } from "@/components/admin/recent-offers"

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage companies, users, offers, and coupons</p>
      </div>
      <AdminStats />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Companies</CardTitle>
            <CardDescription>Recently registered companies</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentCompanies />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Offers</CardTitle>
            <CardDescription>Recently created offers</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentOffers />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
