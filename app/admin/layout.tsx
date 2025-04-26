"use client"

import { AdminNav } from "@/components/admin/admin-nav"
import { Bell, LogOut, User } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { toast } = useToast()
  // Mock unread notifications count - in a real app, this would come from your backend
  const [unreadCount] = useState(3) // Example: 3 unread notifications

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" })
      if (response.ok) {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
        })
        router.push("/auth/login")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4 w-full">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Corporate Perks</span>
            </Link>
            <div className="flex-1 flex justify-center">
              <AdminNav />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/notifications" className="relative">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                  </div>
                )}
              </Link>
              <div className="w-4" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin User</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container p-4">
        {children}
      </main>
    </div>
  )
}
