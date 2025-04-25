"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingBag,
  Gift,
  Users,
  Settings,
  Building2,
  BarChart3,
  FileText,
  Shield,
  UserCog,
} from "lucide-react"

const employeeNavItems = [
  {
    title: "Dashboard",
    href: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Deals",
    href: "/employee/deals",
    icon: ShoppingBag,
  },
  {
    title: "Benefits",
    href: "/employee/benefits",
    icon: Gift,
  },
  {
    title: "Profile",
    href: "/employee/profile",
    icon: UserCog,
  },
]

const companyNavItems = [
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    href: "/company/employees",
    icon: Users,
  },
  {
    title: "Benefits",
    href: "/company/benefits",
    icon: Gift,
  },
  {
    title: "Analytics",
    href: "/company/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/company/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/company/settings",
    icon: Settings,
  },
]

const adminNavItems = [
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
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Benefits",
    href: "/admin/benefits",
    icon: Gift,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Admin",
    href: "/admin/management",
    icon: Shield,
  },
]

export function DashboardNav({ userType }: { userType: "employee" | "company" | "admin" }) {
  const pathname = usePathname()
  const navItems = userType === "employee" ? employeeNavItems : userType === "company" ? companyNavItems : adminNavItems

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
} 