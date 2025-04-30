"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Home } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentOffers } from "@/components/dashboard/recent-offers"
import { useEffect, useState } from "react"

interface Employee {
  id: string;
  email: string;
  name: string;
}

export function UserNav() {
  const router = useRouter()
  const { toast } = useToast()
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch('/api/employee/me');
      if (response.ok) {
        const data = await response.json();
        setEmployee(data.employee);
      }
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { 
        method: "POST",
        credentials: 'include' // Include cookies in the request
      })
      
      if (response.ok) {
        // Clear any client-side state
        setEmployee(null)
        
        // Clear any localStorage items if they exist
        localStorage.removeItem('employee-preferences')
        localStorage.removeItem('theme-preference')
        
        // Show success message
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
        })

        // Force reload to clear any remaining state and redirect
        window.location.href = '/auth/login'
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/mystical-forest-spirit.png" alt={employee?.name || 'User'} />
              <AvatarFallback>{employee?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{employee?.name || 'Loading...'}</p>
              <p className="text-xs leading-none text-zinc-600 dark:text-zinc-300">
                {employee?.email || 'Loading...'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push("/employee/dashboard")}>Dashboard</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
