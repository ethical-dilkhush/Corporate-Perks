"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Tag,
  Ticket,
  Bell,
  Settings,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  CheckCircle2,
  AlertCircle,
  Info,
  User,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

// Mock notification data
const notifications = [
  {
    id: 1,
    type: "success",
    title: "New Company Registered",
    message: "TechGadgets Inc. has joined the platform",
    time: "2 minutes ago",
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: "warning",
    title: "Offer Expiring Soon",
    message: "3 offers will expire in 24 hours",
    time: "1 hour ago",
    icon: AlertCircle,
  },
  {
    id: 3,
    type: "info",
    title: "System Update",
    message: "New features have been added to the dashboard",
    time: "2 hours ago",
    icon: Info,
  },
]

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Companies",
    href: "/admin/companies",
    icon: Building2,
  },
  {
    title: "Offers",
    href: "/admin/offers",
    icon: Tag,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface User {
  name: string
  email: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [unreadCount, setUnreadCount] = useState(notifications.length)
  const router = useRouter()
  const [user] = useState<User>({
    name: "Admin User",
    email: "admin@corporateperks.com"
  })

  const handleNotificationClick = (id: number) => {
    // In a real app, you would mark the notification as read in your backend
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 transform bg-background shadow-lg transition-transform duration-200 ease-in-out border-r",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">Admin Panel</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md p-2 hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-200",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-md p-2 hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="ml-4 font-bold">Corporate Perks</span>
            </div>
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Notifications</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        You have {unreadCount} unread notifications
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <p className="text-sm">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
