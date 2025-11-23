"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  Eye,
  MousePointerClick,
  Activity as ActivityIcon,
  Users,
  Percent,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface OfferMetric {
  id: string
  title: string
  category: string | null
  status: string | null
  start_date: string | null
  end_date: string | null
  redemptions: number | null
  max_redemptions: number | null
  created_at: string | null
  impression_events?: number
  click_events?: number
}

interface EmployeeMetric {
  id: number
  name: string
  email: string
  role: string
  status: string
  created_at: string | null
  engagements?: number
}

interface ActivityItem {
  id: string
  type: "offer" | "coupon" | "employee"
  title: string
  description: string
  timestamp: string
}

interface AnalyticsResponse {
  metrics: {
    impressions: number
    clicks: number
    conversionRate: number
    activeOffers: number
    employees: number
    partners: number
    coupons: number
  }
  offers: {
    list: OfferMetric[]
    top: OfferMetric[]
  }
  employees: {
    recent: EmployeeMetric[]
    engaged: EmployeeMetric[]
  }
  activity: ActivityItem[]
}

const initialAnalytics: AnalyticsResponse = {
  metrics: {
    impressions: 0,
    clicks: 0,
    conversionRate: 0,
    activeOffers: 0,
    employees: 0,
    partners: 0,
    coupons: 0,
  },
  offers: {
    list: [],
    top: [],
  },
  employees: {
    recent: [],
    engaged: [],
  },
  activity: [],
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse>(initialAnalytics)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/company/analytics")
        const payload = await response.json()
        if (!response.ok) {
          throw new Error(payload.error || "Failed to load analytics")
        }
        setData(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const overviewCards = useMemo(
    () => [
      {
        title: "Total Impressions",
        value: data.metrics.impressions.toLocaleString(),
        icon: Eye,
        helper: `${data.metrics.activeOffers} active offers`,
      },
      {
        title: "Total Clicks",
        value: data.metrics.clicks.toLocaleString(),
        icon: MousePointerClick,
        helper: `${data.metrics.coupons} coupons generated`,
      },
      {
        title: "Average CTR",
        value: `${data.metrics.conversionRate.toFixed(1)}%`,
        icon: TrendingUp,
        helper: "Conversion rate across all offers",
      },
      {
        title: "Employees with Access",
        value: data.metrics.employees.toLocaleString(),
        icon: Users,
        helper: `${data.metrics.partners} partner companies`,
      },
    ],
    [data.metrics],
  )

  const renderBar = (value: number, total: number) => {
    const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{value.toLocaleString()}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5 text-destructive">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Unable to load analytics</p>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.helper}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Impressions vs Clicks</CardTitle>
                <CardDescription>Platform interactions for your offers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Impressions</p>
                  {renderBar(data.metrics.impressions, Math.max(data.metrics.impressions, data.metrics.clicks))}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Clicks</p>
                  {renderBar(data.metrics.clicks, Math.max(data.metrics.impressions, data.metrics.clicks))}
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Percent className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current CTR</p>
                      <p className="text-lg font-semibold">
                        {data.metrics.conversionRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Offers</CardTitle>
                <CardDescription>Sorted by redemptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.offers.top.length === 0 && !isLoading && (
                    <p className="text-sm text-muted-foreground">No offers yet.</p>
                  )}
                  {data.offers.top.map((offer) => (
                    <div key={offer.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {offer.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {offer.status || "Unknown status"} • {offer.category || "Uncategorized"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {(offer.redemptions ?? 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">redemptions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          {data.offers.list.length === 0 && !isLoading ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                You haven’t published any offers yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {data.offers.list.map((offer) => (
                <Card key={offer.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{offer.title}</CardTitle>
                    <CardDescription>
                      {offer.category || "Uncategorized"} • {offer.status || "Unknown status"} •{" "}
                      {offer.start_date ? new Date(offer.start_date).toLocaleDateString() : "No start date"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium">Impressions</p>
                        <p className="text-2xl font-bold">
                          {(offer.impression_events ?? offer.max_redemptions ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Clicks / Redemptions</p>
                        <p className="text-2xl font-bold">
                          {(offer.click_events ?? offer.redemptions ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Remaining</p>
                        <p className="text-2xl font-bold">
                          {Math.max((offer.max_redemptions ?? 0) - (offer.redemptions ?? 0), 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recently Added</CardTitle>
                <CardDescription>Latest employees onboarded</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.employees.recent.length === 0 && !isLoading ? (
                  <p className="text-sm text-muted-foreground">No employees yet.</p>
                ) : (
                  data.employees.recent.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium leading-none">
                          {employee.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {employee.role} • {employee.status}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {employee.created_at ? new Date(employee.created_at).toLocaleDateString() : "--"}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Engaged Employees</CardTitle>
                <CardDescription>Based on coupon generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.employees.engaged.length === 0 && !isLoading ? (
                  <p className="text-sm text-muted-foreground">No usage recorded yet.</p>
                ) : (
                  data.employees.engaged.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {employee.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">
                        {employee.engagements ?? 0}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Offer launches, coupon claims, employee onboarding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.activity.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground">No activity recorded.</p>
              ) : (
                data.activity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "rounded-full p-2",
                          item.type === "offer" && "bg-primary/10 text-primary",
                          item.type === "coupon" && "bg-green-100 text-green-600",
                          item.type === "employee" && "bg-blue-100 text-blue-600",
                        )}
                      >
                        <ActivityIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium leading-none">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : "--"}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isLoading && (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Loading analytics...
          </CardContent>
        </Card>
      )}
    </div>
  )
}