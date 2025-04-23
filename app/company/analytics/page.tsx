"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter, TrendingUp, Eye, MousePointerClick } from "lucide-react"

// Mock data for offer performance
const offerPerformance = [
  {
    id: 1,
    title: "Amazon Prime Membership",
    partner: "Amazon",
    impressions: 1250,
    clicks: 450,
    conversionRate: "36%",
    trend: "up",
  },
  {
    id: 2,
    title: "Netflix Premium Plan",
    partner: "Netflix",
    impressions: 980,
    clicks: 320,
    conversionRate: "33%",
    trend: "up",
  },
  {
    id: 3,
    title: "Spotify Family Plan",
    partner: "Spotify",
    impressions: 750,
    clicks: 280,
    conversionRate: "37%",
    trend: "down",
  },
  {
    id: 4,
    title: "Uber Eats Discount",
    partner: "Uber",
    impressions: 620,
    clicks: 190,
    conversionRate: "31%",
    trend: "up",
  },
]

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,600</div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,240</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34.4%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+5 from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Impressions vs Clicks</CardTitle>
                <CardDescription>
                  Performance over the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Performance Chart</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Offers</CardTitle>
                <CardDescription>
                  Based on click-through rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offerPerformance.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{offer.title}</p>
                        <p className="text-sm text-muted-foreground">{offer.partner}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{offer.impressions}</p>
                          <p className="text-xs text-muted-foreground">impressions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{offer.clicks}</p>
                          <p className="text-xs text-muted-foreground">clicks</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{offer.conversionRate}</p>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Offer Performance</CardTitle>
              <CardDescription>
                Detailed analytics for each offer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offerPerformance.map((offer) => (
                  <Card key={offer.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{offer.title}</CardTitle>
                      <CardDescription>{offer.partner}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium">Impressions</p>
                          <p className="text-2xl font-bold">{offer.impressions}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Clicks</p>
                          <p className="text-2xl font-bold">{offer.clicks}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Conversion Rate</p>
                          <p className="text-2xl font-bold">{offer.conversionRate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Engagement</CardTitle>
              <CardDescription>
                How employees are using the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Employee Engagement Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partner Performance</CardTitle>
              <CardDescription>
                How partner companies are performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Partner Performance Chart</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 