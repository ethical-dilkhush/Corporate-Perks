import type React from "react"
import Link from "next/link"
import { Gift } from "lucide-react"
import { UserNav } from "@/components/dashboard/user-nav"

// TODO: Consider moving this to a configuration file or API
const navItems = [
  { name: "Dashboard", href: "/company/dashboard" },
  { name: "Offers", href: "/company/offers" },
  // { name: "Analytics", href: "/company/analytics" },
  { name: "Employees", href: "/company/employees" },
  { name: "Partners", href: "/company/partners" },
  { name: "Settings", href: "/company/settings" },
]

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center">
            <Link href="/company/dashboard" className="flex items-center space-x-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary p-2">
                  <Gift className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-1 font-bold text-xl">
                  <span className="text-primary">Corporate</span>
                  <span>Perks</span>
                </div>
              </div>
            </Link>
            <nav className="hidden md:flex items-center justify-center flex-1 gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[15px] font-semibold tracking-wide transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Corporate Perks Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
} 