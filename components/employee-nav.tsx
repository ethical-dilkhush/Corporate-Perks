"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingBag, Gift, UserCog } from "lucide-react"

const navItems = [
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

export function EmployeeNav() {
  const pathname = usePathname()

  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600">
      <div className="container mx-auto">
        <div className="flex h-16 items-center px-4">
          <nav className="flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-white"
                      : "text-blue-100 hover:text-white"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
} 