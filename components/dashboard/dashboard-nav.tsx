"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Tag, Ticket, History, Settings } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Offers",
    href: "/employee/dashboard/offers",
    icon: Tag,
  },
  {
    title: "My Coupons",
    href: "/employee/dashboard/coupons",
    icon: Ticket,
  },
  {
    title: "History",
    href: "/employee/dashboard/history",
    icon: History,
  },
  {
    title: "Settings",
    href: "/employee/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2 py-6">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
