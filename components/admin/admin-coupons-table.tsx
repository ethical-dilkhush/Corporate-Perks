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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Eye, Ban, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for coupons
const mockCoupons = [
  {
    id: "1",
    code: "TECH20-ABC123",
    offerTitle: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    user: "john.doe@company.com",
    discountValue: 20,
    createdAt: "2025-01-15",
    redeemedAt: null,
    status: "ACTIVE",
  },
  {
    id: "2",
    code: "COFFEE50-XYZ789",
    offerTitle: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    user: "jane.smith@company.com",
    discountValue: 50,
    createdAt: "2025-01-10",
    redeemedAt: "2025-01-20",
    status: "USED",
  },
  {
    id: "3",
    code: "OFFICE15-DEF456",
    offerTitle: "15% off Office Supplies",
    company: "OfficeMax",
    user: "bob.johnson@company.com",
    discountValue: 15,
    createdAt: "2024-11-15",
    redeemedAt: null,
    status: "EXPIRED",
  },
  {
    id: "4",
    code: "FITNESS30-GHI789",
    offerTitle: "30% off Fitness Membership",
    company: "FitLife Gyms",
    user: "alice.brown@company.com",
    discountValue: 30,
    createdAt: "2025-01-05",
    redeemedAt: null,
    status: "ACTIVE",
  },
  {
    id: "5",
    code: "TRAVEL25-JKL012",
    offerTitle: "25% off Business Travel",
    company: "TravelPro",
    user: "david.wilson@company.com",
    discountValue: 25,
    createdAt: "2025-01-08",
    redeemedAt: null,
    status: "ACTIVE",
  },
]

export function AdminCouponsTable() {
  const [coupons] = useState(mockCoupons)
  const { toast } = useToast()

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied",
      description: "Coupon code copied to clipboard",
    })
  }

  const handleInvalidateCoupon = (couponId: string) => {
    toast({
      title: "Coupon invalidated",
      description: "The coupon has been invalidated",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Offer</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Redeemed</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-mono text-sm">{coupon.code}</TableCell>
              <TableCell>{coupon.offerTitle}</TableCell>
              <TableCell>{coupon.company}</TableCell>
              <TableCell>{coupon.user}</TableCell>
              <TableCell>{new Date(coupon.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{coupon.redeemedAt ? new Date(coupon.redeemedAt).toLocaleDateString() : "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={coupon.status === "ACTIVE" ? "default" : coupon.status === "USED" ? "secondary" : "outline"}
                >
                  {coupon.status}
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
                      <Link href={`/admin/coupons/${coupon.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopyCode(coupon.code)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy code
                    </DropdownMenuItem>
                    {coupon.status === "ACTIVE" && (
                      <DropdownMenuItem onClick={() => handleInvalidateCoupon(coupon.id)}>
                        <Ban className="mr-2 h-4 w-4 text-amber-500" />
                        Invalidate
                      </DropdownMenuItem>
                    )}
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
