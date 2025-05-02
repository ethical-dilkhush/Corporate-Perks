"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Plus, Users, BarChart, Settings, Trash2, Edit2 } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"

// Define types for our data structures
interface PartnerCompany {
  id: string | number
  name: string
  email: string
  offers: number
  status: string
}

interface Offer {
  id: string | number
  title: string
  company: string
  discount: string
  validity: string
  status: string
}

interface Partner {
  id: string | number
  company_name: string
  [key: string]: any
}

export default function CompanyDashboardPage() {
  const router = useRouter()
  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeOffers: 0,
    partnerCompanies: 0
  })
  const [partnerCompanies, setPartnerCompanies] = useState<PartnerCompany[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [topPartners, setTopPartners] = useState<Partner[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all stats in parallel
      const [
        { count: employeeCount, error: employeeError },
        { count: offerCount, error: offerError },
        { count: partnerCount, error: partnerError },
        { data: partnersData, error: partnersError },
        { data: offersData, error: offersError },
        { data: topPartnersData, error: topPartnersError }
      ] = await Promise.all([
        supabase.from('employees').select('*', { count: 'exact', head: true }),
        supabase.from('offers').select('*', { count: 'exact', head: true }),
        supabase.from('partners').select('*', { count: 'exact', head: true }),
        supabase.from('partners').select('*').limit(5),
        supabase.from('offers').select('*').limit(5),
        supabase.from('partners').select('*').order('offers', { ascending: false }).limit(5)
      ])

      if (employeeError) console.error('Employee error:', employeeError)
      if (offerError) console.error('Offer error:', offerError)
      if (partnerError) console.error('Partner error:', partnerError)

      setStats({
        totalEmployees: employeeCount || 0,
        activeOffers: offerCount || 0,
        partnerCompanies: partnerCount || 0
      })

      // Format partner companies data
      if (partnersData) {
        setPartnerCompanies(partnersData.map(partner => ({
          id: partner.id,
          name: partner.company_name || 'Unknown Company',
          email: partner.email || 'No email',
          offers: partner.offers_count || 0,
          status: partner.status || 'Active'
        })))
      }

      // Format offers data
      if (offersData) {
        setOffers(offersData.map(offer => ({
          id: offer.id,
          title: offer.title || 'Untitled Offer',
          company: offer.partner_name || 'Unknown',
          discount: offer.discount_type === 'Percentage' ? `${offer.discount_value}%` : `$${offer.discount_value}`,
          validity: offer.end_date ? `${new Date(offer.end_date).toLocaleDateString()}` : '30 days',
          status: offer.status || 'Active'
        })))
      }

      // Set top partners
      if (topPartnersData) {
        setTopPartners(topPartnersData)
      }
    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout userType="company">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Company Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={() => router.push("/company/partners/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Partner
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push("/company/offers/new")}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Offer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.partnerCompanies}</div>
              <p className="text-xs text-muted-foreground">From partners table</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeOffers}</div>
              <p className="text-xs text-muted-foreground">From offers table</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">From employees table</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-muted-foreground">Set to zero</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Partner Companies</CardTitle>
              <CardDescription>
                Manage your partner companies and their offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Offers</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partnerCompanies.length > 0 ? (
                      partnerCompanies.map((company) => (
                        <TableRow key={String(company.id)}>
                          <TableCell className="font-medium">{company.name}</TableCell>
                          <TableCell>{company.email}</TableCell>
                          <TableCell>{company.offers}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              company.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {company.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No partner companies found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Offers</CardTitle>
              <CardDescription>
                View and manage your current offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.length > 0 ? (
                      offers.map((offer) => (
                        <TableRow key={String(offer.id)}>
                          <TableCell className="font-medium">{offer.title}</TableCell>
                          <TableCell>{offer.company}</TableCell>
                          <TableCell>{offer.discount}</TableCell>
                          <TableCell>{offer.validity}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                              {offer.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No offers found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 