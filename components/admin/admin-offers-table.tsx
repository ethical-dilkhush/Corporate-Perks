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
import { MoreHorizontal, Edit, Trash, Eye, Ban } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for offers
const mockOffers = [
  {
    id: "1",
    title: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    discountValue: 20,
    validFrom: "2025-01-01",
    validUntil: "2025-06-30",
    couponsGenerated: 45,
    status: "active",
  },
  {
    id: "2",
    title: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    discountValue: 50,
    validFrom: "2025-01-15",
    validUntil: "2025-05-15",
    couponsGenerated: 38,
    status: "active",
  },
  {
    id: "3",
    title: "15% off Office Supplies",
    company: "OfficeMax",
    discountValue: 15,
    validFrom: "2025-02-01",
    validUntil: "2025-07-01",
    couponsGenerated: 27,
    status: "scheduled",
  },
  {
    id: "4",
    title: "30% off Fitness Membership",
    company: "FitLife Gyms",
    discountValue: 30,
    validFrom: "2025-01-01",
    validUntil: "2025-12-31",
    couponsGenerated: 56,
    status: "active",
  },
  {
    id: "5",
    title: "25% off Business Travel",
    company: "TravelPro",
    discountValue: 25,
    validFrom: "2025-01-01",
    validUntil: "2025-08-31",
    couponsGenerated: 63,
    status: "active",
  },
]

export function AdminOffersTable() {
  const [offers] = useState(mockOffers)
  const { toast } = useToast()

  const handleSuspendOffer = (offerId: string) => {
    toast({
      title: "Offer suspended",
      description: "The offer has been suspended",
    })
  }

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
            <TableHead>Company</TableHead>
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
              <TableCell>{offer.company}</TableCell>
              <TableCell>{offer.discountValue}%</TableCell>
              <TableCell>
                {new Date(offer.validFrom).toLocaleDateString()} - {new Date(offer.validUntil).toLocaleDateString()}
              </TableCell>
              <TableCell>{offer.couponsGenerated}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
