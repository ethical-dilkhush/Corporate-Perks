"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Building2, Plus, Search, ExternalLink, Mail, Phone, MapPin } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Partner {
  id: string
  owner_company_id: string | null
  partner_company_id: string | null
  company_name: string
  business_type: string
  email: string
  phone: string
  website: string | null
  address: string
  city: string
  state: string
  pincode: string
  employee_count: string
  partnership_type: string
  image_url: string | null
  created_at: string
}

export default function PartnersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = useMemo(() => createClientComponentClient(), [])
  const [partners, setPartners] = useState<Partner[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [companyId, setCompanyId] = useState<string | null>(null)

  const fetchPartners = useCallback(async (currentCompanyId: string) => {
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("owner_company_id", currentCompanyId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching partners:", error)
        return
      }

      setPartners(data || [])
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  const loadCompanySession = useCallback(async () => {
    setIsLoading(true)
    const {
      data: sessionData,
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Failed to load company session:", error)
      toast({
        title: "Unable to verify session",
        description: "Please try signing in again.",
        variant: "destructive",
      })
      setCompanyId(null)
      setPartners([])
      setIsLoading(false)
      return
    }

    const session = sessionData.session
    if (!session) {
      setCompanyId(null)
      setPartners([])
      setIsLoading(false)
      router.push("/auth/login")
      return
    }

    setCompanyId(session.user.id)
    await fetchPartners(session.user.id)
  }, [fetchPartners, router, supabase, toast])

  useEffect(() => {
    let isMounted = true
    loadCompanySession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return

      if (session) {
        setCompanyId(session.user.id)
        fetchPartners(session.user.id)
      } else {
        setCompanyId(null)
        setPartners([])
        router.push("/auth/login")
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchPartners, loadCompanySession, router, supabase])

  const filteredPartners = partners.filter((partner) =>
    partner.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.business_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleViewDetails = (partner: Partner) => {
    setSelectedPartner(partner)
    setIsDetailsOpen(true)
  }

  const handleRemovePartner = async (partnerId: string) => {
    try {
      setIsRemoving(true)
      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", partnerId)

      if (error) {
        throw error
      }

      setPartners((prev) => prev.filter((p) => p.id !== partnerId))
      setIsDetailsOpen(false)

      toast({
        title: "Partner removed",
        description: "The partner has been successfully removed.",
      })
    } catch (error) {
      console.error("Error removing partner:", error)
      toast({
        title: "Error",
        description: "Failed to remove partner. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRemoving(false)
    }
  }

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
                {Array.from(new Set(partners.map(p => p.business_type))).map((type) => (
                  <button
                    key={type}
                    className="flex items-center justify-between w-full p-2 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    <span>{type}</span>
                    <Badge variant="secondary">
                      {partners.filter(p => p.business_type === type).length}
                    </Badge>
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
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">Loading partners...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Business Type</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          No partners found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPartners.map((partner) => (
                        <TableRow
                          key={partner.id}
                          onClick={() => handleViewDetails(partner)}
                          className="cursor-pointer hover:bg-muted/40"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {partner.image_url ? (
                                <img
                                  src={partner.image_url}
                                  alt={partner.company_name}
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="rounded-lg bg-primary/10 p-2">
                                  <Building2 className="h-5 w-5 text-primary" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{partner.company_name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {partner.city}, {partner.state}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{partner.business_type}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{partner.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{partner.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Partner Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Partner Details</DialogTitle>
            <DialogDescription>
              View complete information about the partner company
            </DialogDescription>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {selectedPartner.image_url ? (
                  <img
                    src={selectedPartner.image_url}
                    alt={selectedPartner.company_name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedPartner.company_name}</h3>
                  <p className="text-muted-foreground">{selectedPartner.business_type}</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Contact Information</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPartner.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPartner.phone}</span>
                    </div>
                    {selectedPartner.website && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={selectedPartner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {selectedPartner.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Company Details</h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPartner.employee_count} Employees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedPartner.partnership_type === "Exclusive" ? "default" : "secondary"}>
                        {selectedPartner.partnership_type} Partnership
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <h4 className="font-medium">Address</h4>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedPartner.address}, {selectedPartner.city}, {selectedPartner.state} - {selectedPartner.pincode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedPartner && (
            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDetailsOpen(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={isRemoving}
                onClick={() => handleRemovePartner(selectedPartner.id)}
              >
                {isRemoving ? "Removing..." : "Remove Partner"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 