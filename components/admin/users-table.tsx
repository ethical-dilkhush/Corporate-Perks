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
import { MoreHorizontal, Edit, Trash, Ban, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@company.com",
    role: "EMPLOYEE",
    company: "TechGadgets Inc.",
    emailVerified: true,
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "EMPLOYEE",
    company: "BeanBrew Coffee",
    emailVerified: true,
    createdAt: "2025-01-10",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    role: "COMPANY",
    company: "OfficeMax",
    emailVerified: true,
    createdAt: "2025-01-05",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice.brown@company.com",
    role: "EMPLOYEE",
    company: "CloudSoft Solutions",
    emailVerified: false,
    createdAt: "2025-01-20",
  },
  {
    id: "5",
    name: "Admin User",
    email: "admin@corporateperks.com",
    role: "ADMIN",
    company: null,
    emailVerified: true,
    createdAt: "2025-01-01",
  },
]

export function UsersTable() {
  const [users] = useState(mockUsers)
  const { toast } = useToast()

  const handleSuspendUser = (userId: string) => {
    toast({
      title: "User suspended",
      description: "The user has been suspended",
    })
  }

  const handleActivateUser = (userId: string) => {
    toast({
      title: "User activated",
      description: "The user has been activated",
    })
  }

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "User deleted",
      description: "The user has been deleted successfully",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.role === "ADMIN" ? "default" : user.role === "COMPANY" ? "outline" : "secondary"}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.company || "-"}</TableCell>
              <TableCell>
                <Badge variant={user.emailVerified ? "default" : "outline"}>
                  {user.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
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
                      <Link href={`/admin/users/${user.id}`}>View details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/users/${user.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    {user.emailVerified ? (
                      <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                        <Ban className="mr-2 h-4 w-4 text-amber-500" />
                        Suspend
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => handleActivateUser(user.id)}>
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        Activate
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteUser(user.id)}
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
