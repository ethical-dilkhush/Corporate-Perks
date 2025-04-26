import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentCompanies } from "@/components/admin/recent-companies"
import { RecentOffers } from "@/components/admin/recent-offers"
import Link from "next/link"
import { Building, Users, Tag, Ticket, Settings, Bell } from "lucide-react"

export default function AdminDashboardPage() {
  // Mock stats for badges (replace with real data as needed)
  const pendingApprovals = 3
  const unverifiedUsers = 5
  const activeOffers = 12
  const activeCoupons = 48
  const unreadNotifications = 7

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome! Here's an overview and quick access to all admin modules.</p>
        </div>
        <Link href="/admin/settings">
          <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
            <Settings className="mr-2 h-5 w-5 text-blue-600" /> Settings
          </Button>
        </Link>
      </div>
      <AdminStats />
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
        {/* Companies */}
        <Card className="group hover:shadow-lg transition-all border-blue-100">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Building className="h-7 w-7 text-blue-600 bg-blue-50 rounded-full p-1" />
            <div>
              <CardTitle>Companies</CardTitle>
              <CardDescription>Register, approve, edit, or block companies</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 w-fit" title="Pending Approvals">{pendingApprovals} Pending</Badge>
            <span className="text-sm text-muted-foreground">Location management, edit, delete/block</span>
            <Link href="/admin/companies">
              <Button variant="outline" className="mt-2 w-full border-blue-600 text-blue-600 group-hover:bg-blue-50">Manage Companies</Button>
            </Link>
          </CardContent>
        </Card>
        {/* Users */}
        <Card className="group hover:shadow-lg transition-all border-blue-100">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Users className="h-7 w-7 text-blue-600 bg-blue-50 rounded-full p-1" />
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>View, search, filter, and manage users</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Badge variant="outline" className="border-yellow-200 text-yellow-700 bg-yellow-50 w-fit" title="Unverified Users">{unverifiedUsers} Unverified</Badge>
            <span className="text-sm text-muted-foreground">Bulk actions, verification, reset passwords, verify emails</span>
            <Link href="/admin/users">
              <Button variant="outline" className="mt-2 w-full border-blue-600 text-blue-600 group-hover:bg-blue-50">Manage Users</Button>
            </Link>
          </CardContent>
        </Card>
        {/* Offers */}
        <Card className="group hover:shadow-lg transition-all border-blue-100">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Tag className="h-7 w-7 text-blue-600 bg-blue-50 rounded-full p-1" />
            <div>
              <CardTitle>Offers</CardTitle>
              <CardDescription>All active/inactive offers</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 w-fit" title="Active Offers">{activeOffers} Active</Badge>
            <span className="text-sm text-muted-foreground">Create, edit, deactivate, view usage</span>
            <Link href="/admin/offers">
              <Button variant="outline" className="mt-2 w-full border-blue-600 text-blue-600 group-hover:bg-blue-50">Manage Offers</Button>
            </Link>
          </CardContent>
        </Card>
        {/* Coupons */}
        <Card className="group hover:shadow-lg transition-all border-blue-100">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Ticket className="h-7 w-7 text-blue-600 bg-blue-50 rounded-full p-1" />
            <div>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>All generated coupons</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 w-fit" title="Active Coupons">{activeCoupons} Active</Badge>
            <span className="text-sm text-muted-foreground">Status, redemption, deactivate/delete</span>
            <Link href="/admin/coupons">
              <Button variant="outline" className="mt-2 w-full border-blue-600 text-blue-600 group-hover:bg-blue-50">Manage Coupons</Button>
            </Link>
          </CardContent>
        </Card>
        {/* Settings */}
        <Card className="group hover:shadow-lg transition-all border-blue-100">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Settings className="h-7 w-7 text-blue-600 bg-blue-50 rounded-full p-1" />
            <div>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Admin password, API keys, backup/restore</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <span className="text-sm text-muted-foreground">Reset password, manage API keys, backup & restore</span>
            <Link href="/admin/settings">
              <Button variant="outline" className="mt-2 w-full border-blue-600 text-blue-600 group-hover:bg-blue-50">Settings</Button>
            </Link>
          </CardContent>
        </Card>
        {/* Notifications */}
        <Card className="group hover:shadow-lg transition-all border-blue-100">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Bell className="h-7 w-7 text-blue-600 bg-blue-50 rounded-full p-1" />
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Unread, mark as read, clear all</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 w-fit" title="Unread Notifications">{unreadNotifications} Unread</Badge>
            <span className="text-sm text-muted-foreground">Stay updated with system notifications</span>
            <Link href="/admin/notifications">
              <Button variant="outline" className="mt-2 w-full border-blue-600 text-blue-600 group-hover:bg-blue-50">View Notifications</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      {/* Recent Activity Section */}
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle>Recent Companies</CardTitle>
            <CardDescription>Recently registered companies</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentCompanies />
          </CardContent>
        </Card>
        <Card className="border-blue-100">
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
