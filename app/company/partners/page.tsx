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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Building2,
  Plus,
  ExternalLink,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Check,
  Clock,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Mock data - in real app, this would come from an API
const partners = [
  {
    id: 1,
    name: "TechStore Electronics",
    category: "Electronics",
    status: "Active",
    offers: 5,
    redemptions: 234,
    engagement: "85%",
    contact: {
      name: "John Smith",
      email: "john@techstore.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
    },
  },
  {
    id: 2,
    name: "FitLife Gym",
    category: "Health & Fitness",
    status: "Active",
    offers: 3,
    redemptions: 156,
    engagement: "72%",
    contact: {
      name: "Sarah Johnson",
      email: "sarah@fitlife.com",
      phone: "+1 (555) 234-5678",
      location: "Los Angeles, CA",
    },
  },
  {
    id: 3,
    name: "FoodExpress",
    category: "Food & Dining",
    status: "Pending",
    offers: 0,
    redemptions: 0,
    engagement: "0%",
    contact: {
      name: "Mike Wilson",
      email: "mike@foodexpress.com",
      phone: "+1 (555) 345-6789",
      location: "Chicago, IL",
    },
  },
]

const partnerCategories = [
  { name: "Electronics", count: 3 },
  { name: "Health & Fitness", count: 2 },
  { name: "Food & Dining", count: 4 },
  { name: "Entertainment", count: 1 },
  { name: "Travel", count: 2 },
]

export default function PartnersPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Partner Companies
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your partnerships and collaborations
            </p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Input
                placeholder="Search partners..."
                className="w-[300px] pl-8"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Button 
              className="shadow-lg hover:shadow-primary/30 transition-all duration-300"
              onClick={() => router.push("/company/partners/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Partner
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {/* Categories Sidebar */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
              <CardDescription>Filter partners by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {partnerCategories.map((category) => (
                  <button
                    key={category.name}
                    className="flex items-center justify-between w-full p-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    <span>{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partners Table */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg">Partner Companies</CardTitle>
              <CardDescription>View and manage your partnerships</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Offers</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{partner.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {partner.contact.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{partner.category}</TableCell>
                      <TableCell>
                        <Badge
                          variant={partner.status === "Active" ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {partner.status === "Active" ? (
                            <Check className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {partner.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{partner.offers}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{
                                width: partner.engagement,
                              }}
                            />
                          </div>
                          <span className="text-sm">{partner.engagement}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Contact Partner
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Remove Partner
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 