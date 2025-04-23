"use client"

import { useState } from "react"
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
import { MoreHorizontal, Edit, Trash, BarChart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for offers
const mockOffers = [
  {
    id: "1",
    title: "20% off at TechGadgets",
    discountValue: 20,
    validFrom: "2025-01-01",
    validUntil: "2025-06-30",
    couponsGenerated: 45,
    couponsRedeemed: 32,
    status: "active",
  },
  {
    id: "2",
    title: "Summer Special: 25% off Electronics",
    discountValue: 25,
    validFrom: "2025-05-01",
    validUntil: "2025-08-31",
    couponsGenerated: 38,
    couponsRedeemed: 24,
    status: "active",
  },
  {
    id: "3",
    title: "Holiday Bundle: 30% off",
    discountValue: 30,
    validFrom: "2025-11-01",
    validUntil: "2025-12-31",
    couponsGenerated: 27,
    couponsRedeemed: 18,
    status: "scheduled",
  },
  {
    id: "4",
    title: "Flash Sale: 40% off Selected Items",
    discountValue: 40,
    validFrom: "2025-02-01",
    validUntil: "2025-02-15",
    couponsGenerated: 56,
    couponsRedeemed: 42,
    status: "expired",
  },
  {
    id: "5",
    title: "New Year Special: 15% off",
    discountValue: 15,
    validFrom: "2025-01-01",
    validUntil: "2025-01-31",
    couponsGenerated: 63,
    couponsRedeemed: 51,
    status: "expired",
  },
]

export function OffersTable() {
  const [offers] = useState(mockOffers)
  const { toast } = useToast()

  const handleDeleteOffer = (offerId: string) => {
    toast({
      title: "Offer deleted",
      description: "The offer has been deleted successfully",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Offer</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Valid Period</TableHead>
            <TableHead>Coupons</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <TableRow key={offer.id}>
              <TableCell className="font-medium">{offer.title}</TableCell>
              <TableCell>{offer.discountValue}%</TableCell>
              <TableCell>
                {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {offer.couponsRedeemed}/{offer.couponsGenerated} redeemed
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    offer.status === "active" ? "default" : offer.status === "scheduled" ? "outline" : "secondary"
                  }
                >
                  {offer.status === "active" ? "Active" : offer.status === "scheduled" ? "Scheduled" : "Expired"}
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
                      <Link href={`/company/offers/${offer.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/company/offers/${offer.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/company/offers/${offer.id}/analytics`}>
                        <BarChart className="mr-2 h-4 w-4" />
                        Analytics
                      </Link>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
