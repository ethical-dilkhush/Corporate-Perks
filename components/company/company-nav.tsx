"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Tag, BarChart, Settings, Users } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Offers",
    href: "/company/offers",
    icon: Tag,
  },
  {
    title: "Analytics",
    href: "/company/analytics",
    icon: BarChart,
  },
  {
    title: "Employees",
    href: "/company/employees",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/company/settings",
    icon: Settings,
  },
]

export function CompanyNav() {
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
