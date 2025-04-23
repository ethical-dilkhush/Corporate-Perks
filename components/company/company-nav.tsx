"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Building, BarChart, Users, Settings } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/company/dashboard",
    icon: Building,
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
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <nav className="flex items-center space-x-6 lg:space-x-6">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-black dark:text-white"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Create Offer
          </Button>
        </div>
      </div>
    </div>
  )
} 