"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for coupon history
const mockHistory = {
  all: [
    {
      id: "1",
      code: "TECH20-ABC123",
      offerTitle: "20% off at TechGadgets",
      company: "TechGadgets Inc.",
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
      discountValue: 15,
      createdAt: "2024-11-15",
      redeemedAt: null,
      status: "EXPIRED",
    },
  ],
  redeemed: [
    {
      id: "2",
      code: "COFFEE50-XYZ789",
      offerTitle: "50% off Premium Coffee",
      company: "BeanBrew Coffee",
      discountValue: 50,
      createdAt: "2025-01-10",
      redeemedAt: "2025-01-20",
      status: "USED",
    },
  ],
  expired: [
    {
      id: "3",
      code: "OFFICE15-DEF456",
      offerTitle: "15% off Office Supplies",
      company: "OfficeMax",
      discountValue: 15,
      createdAt: "2024-11-15",
      redeemedAt: null,
      status: "EXPIRED",
    },
  ],
}

interface HistoryListProps {
  filter: "all" | "redeemed" | "expired"
}

export function HistoryList({ filter }: HistoryListProps) {
  const [history] = useState(mockHistory[filter])

  if (history.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No coupon history found for this filter.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Code</TableHead>
            <TableHead>Offer</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Redeemed</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-mono text-sm">{item.code}</TableCell>
              <TableCell>{item.offerTitle}</TableCell>
              <TableCell>{item.company}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{item.redeemedAt ? new Date(item.redeemedAt).toLocaleDateString() : "-"}</TableCell>
              <TableCell>
                <Badge
                  variant={item.status === "ACTIVE" ? "default" : item.status === "USED" ? "secondary" : "outline"}
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
