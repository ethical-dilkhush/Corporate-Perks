"use client";
import type React from "react"
import Link from "next/link"
import { Gift } from "lucide-react"
import { UserNav } from "@/components/dashboard/user-nav"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex h-16 items-center justify-between">
              <Link href="/employee" className="flex items-center space-x-2 mr-4">
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
                <UserNav />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 bg-background">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
} 