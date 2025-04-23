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
import { MoreHorizontal, Edit, Trash, Check, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for companies
const mockCompanies = [
  {
    id: "1",
    name: "TechGadgets Inc.",
    website: "https://techgadgets.example.com",
    status: "APPROVED",
    createdAt: "2025-01-15",
    offersCount: 5,
  },
  {
    id: "2",
    name: "BeanBrew Coffee",
    website: "https://beanbrew.example.com",
    status: "APPROVED",
    createdAt: "2025-01-10",
    offersCount: 3,
  },
  {
    id: "3",
    name: "OfficeMax",
    website: "https://officemax.example.com",
    status: "APPROVED",
    createdAt: "2025-01-05",
    offersCount: 2,
  },
  {
    id: "4",
    name: "CloudSoft Solutions",
    website: "https://cloudsoft.example.com",
    status: "PENDING",
    createdAt: "2025-01-20",
    offersCount: 0,
  },
  {
    id: "5",
    name: "Green Energy Co.",
    website: "https://greenenergy.example.com",
    status: "APPROVED",
    createdAt: "2025-01-18",
    offersCount: 1,
  },
]

export function CompaniesTable() {
  const [companies] = useState(mockCompanies)
  const { toast } = useToast()

  const handleApproveCompany = (companyId: string) => {
    toast({
      title: "Company approved",
      description: "The company has been approved successfully",
    })
  }

  const handleRejectCompany = (companyId: string) => {
    toast({
      title: "Company rejected",
      description: "The company has been rejected",
    })
  }

  const handleDeleteCompany = (companyId: string) => {
    toast({
      title: "Company deleted",
      description: "The company has been deleted successfully",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Offers</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {company.website}
                </a>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    company.status === "APPROVED" ? "default" : company.status === "PENDING" ? "outline" : "destructive"
                  }
                >
                  {company.status}
                </Badge>
              </TableCell>
              <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{company.offersCount}</TableCell>
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
                      <Link href={`/admin/companies/${company.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/companies/${company.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    {company.status === "PENDING" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleApproveCompany(company.id)}>
                          <Check className="mr-2 h-4 w-4 text-green-500" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRejectCompany(company.id)}>
                          <X className="mr-2 h-4 w-4 text-red-500" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteCompany(company.id)}
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
