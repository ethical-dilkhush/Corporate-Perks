import type React from "react"
import Link from "next/link"
import { Gift, Home } from "lucide-react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { UserNav } from "@/components/dashboard/user-nav"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/employee" className="flex items-center space-x-2">
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
            <div className="flex items-center gap-4">
              <Link href="/employee">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Button>
              </Link>
              <UserNav />
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:gap-8 py-6">
          <aside className="hidden w-[200px] flex-col md:flex">
            <DashboardNav />
          </aside>
          <main className="flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
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
