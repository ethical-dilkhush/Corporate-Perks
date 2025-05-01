"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Edit, Trash, Eye, Ban } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

// Interface for offer data
interface Offer {
  id: string;
  title: string;
  company: string;
  discountValue: number;
  validFrom: string;
  validUntil: string;
  couponsGenerated: number;
  status: string;
}

export function AdminOffersTable() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      
      // Fetch offers data with partner information
      const { data, error } = await supabase
        .from('offers')
        .select('*, partners(company_name)')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching offers:', error)
        toast({
          title: "Error",
          description: "Failed to fetch offers data",
          variant: "destructive"
        })
        return
      }

      if (data) {
        // Format offers data
        const formattedOffers = data.map(offer => {
          // Determine status based on dates
          const now = new Date()
          const startDate = new Date(offer.start_date)
          const endDate = new Date(offer.end_date)
          
          let status = "active"
          if (now < startDate) {
            status = "scheduled"
          } else if (now > endDate) {
            status = "expired"
          }

          return {
            id: offer.id,
            title: offer.title || "Untitled Offer",
            company: offer.partners?.company_name || 'Unknown Company',
            discountValue: offer.discount_value ? parseFloat(offer.discount_value) : 0,
            validFrom: offer.start_date,
            validUntil: offer.end_date,
            couponsGenerated: offer.redemptions || 0,
            status: offer.status || status
          }
        })

        setOffers(formattedOffers)
      }
    } catch (error) {
      console.error('Error in fetchOffers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'suspended' })
        .eq('id', offerId)
      
      if (error) {
        throw error
      }
      
      // Update local state
      setOffers(offers.map(offer => 
        offer.id === offerId ? { ...offer, status: 'suspended' } : offer
      ))
      
      toast({
        title: "Offer suspended",
        description: "The offer has been suspended successfully",
      })
    } catch (error) {
      console.error('Error suspending offer:', error)
      toast({
        title: "Error",
        description: "Failed to suspend the offer",
        variant: "destructive"
      })
    }
  }

  const handleDeleteOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId)
      
      if (error) {
        throw error
      }
      
      // Update local state
      setOffers(offers.filter(offer => offer.id !== offerId))
      
      toast({
        title: "Offer deleted",
        description: "The offer has been deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting offer:', error)
      toast({
        title: "Error",
        description: "Failed to delete the offer",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offer</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Valid Period</TableHead>
            <TableHead>Coupons</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </TableCell>
            </TableRow>
          ) : offers.length > 0 ? (
            offers.map((offer) => (
              <TableRow key={offer.id}>
                <TableCell className="font-medium">{offer.title}</TableCell>
                <TableCell>{offer.company}</TableCell>
                <TableCell>{offer.discountValue}%</TableCell>
                <TableCell>
                  {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}
                </TableCell>
                <TableCell>{offer.couponsGenerated}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      offer.status === "active" ? "default" : 
                      offer.status === "scheduled" ? "outline" : 
                      offer.status === "suspended" ? "destructive" :
                      "secondary"
                    }
                  >
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/offers/${offer.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/offers/${offer.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSuspendOffer(offer.id)}>
                        <Ban className="mr-2 h-4 w-4 text-amber-500" />
                        Suspend
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No offers found. Try adding a new offer.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
