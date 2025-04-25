"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmployeeDashboard() {
  return (
    <DashboardLayout userType="employee">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <p className="text-muted-foreground">
          Welcome back, John Doe! Here's an overview of your perks.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Offers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 since last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Generate coupons from offers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No coupons expiring soon</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Offers</CardTitle>
              <p className="text-sm text-muted-foreground">Latest discounts available for you</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">20% off at TechGadgets</p>
                    <p className="text-sm text-muted-foreground">TechGadgets Inc.</p>
                    <p className="text-xs text-muted-foreground">Valid until 30/6/2025</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-black px-2 py-1 text-xs text-white">20% OFF</span>
                    <button className="text-sm font-medium text-primary hover:underline">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Coupons</CardTitle>
              <p className="text-sm text-muted-foreground">Your currently active discount coupons</p>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  You don't have any active coupons yet.<br />
                  Browse offers to generate coupons.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 