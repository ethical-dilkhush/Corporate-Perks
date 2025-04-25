"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart3,
  Users,
  Building2,
  Gift,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Bell,
  ExternalLink,
  Calendar,
  DollarSign,
  Target,
  Award,
  Zap,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"

// Mock data - in real app, this would come from an API
const recentActivities = [
  {
    id: 1,
    action: "New offer created",
    description: "20% off on Electronics",
    timestamp: "2 hours ago",
    icon: Gift,
    color: "text-blue-500",
  },
  {
    id: 2,
    action: "Employee joined",
    description: "5 new employees registered",
    timestamp: "5 hours ago",
    icon: Users,
    color: "text-green-500",
  },
  {
    id: 3,
    action: "Offer redeemed",
    description: "10 coupons used today",
    timestamp: "1 day ago",
    icon: BarChart3,
    color: "text-purple-500",
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "New Partner Onboarding",
    date: "Tomorrow",
    type: "Meeting",
    icon: Building2,
  },
  {
    id: 2,
    title: "Employee Benefits Review",
    date: "Next Week",
    type: "Deadline",
    icon: Target,
  },
  {
    id: 3,
    title: "Summer Perks Launch",
    date: "In 2 weeks",
    type: "Event",
    icon: Zap,
  },
]

const topPartners = [
  {
    name: "TechStore Electronics",
    category: "Electronics",
    activeOffers: 5,
    engagement: "85%",
    savings: "₹125,000",
  },
  {
    name: "FitLife Gym",
    category: "Health & Fitness",
    activeOffers: 3,
    engagement: "72%",
    savings: "₹85,000",
  },
  {
    name: "FoodExpress",
    category: "Food & Dining",
    activeOffers: 2,
    engagement: "68%",
    savings: "₹65,000",
  },
]

export default function CompanyPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Company Overview
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! Here's what's happening with your perks program.
            </p>
          </div>
          <div className="flex gap-4">
            <Button 
              className="shadow-lg hover:shadow-primary/30 transition-all duration-300" 
              size="lg"
              onClick={() => router.push("/company/offers/new")}
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Offer
            </Button>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-2">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">2,853</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-500 text-sm font-medium">+180</span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-2">
                <Gift className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">12</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-500 text-sm font-medium">+3</span>
                <span className="text-xs text-muted-foreground">new this month</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-2">
                <DollarSign className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">₹275K</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-500 text-sm font-medium">+12%</span>
                <span className="text-xs text-muted-foreground">this quarter</span>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
              <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-2">
                <Building2 className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">8</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-500 text-sm font-medium">+2</span>
                <span className="text-xs text-muted-foreground">new partnerships</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your perks program</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-4 group">
                      <div className={`rounded-full p-2 ${activity.color.replace('text', 'bg')}/10`}>
                        <Icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">
                          {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Upcoming Events</CardTitle>
                  <CardDescription>Schedule and deadlines</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 group">
                    <div className="rounded-full bg-primary/10 p-2">
                      <event.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          {event.type}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Partners Overview */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Top Performing Partners</CardTitle>
                <CardDescription>Partners with highest engagement and savings</CardDescription>
              </div>
              <Button variant="outline" className="group" onClick={() => window.location.href = '/company/partners'}>
                View All Partners
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topPartners.map((partner, index) => (
                <div key={index} className="flex items-center gap-6 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold truncate">{partner.name}</h3>
                      <span className="text-sm font-medium text-green-500">{partner.savings}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{partner.category}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{partner.activeOffers} active offers</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: partner.engagement }}
                        />
                      </div>
                      <span className="text-sm font-medium">{partner.engagement}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full group" onClick={() => router.push('/company/partners/new')}>
              Add New Partner
              <Plus className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 