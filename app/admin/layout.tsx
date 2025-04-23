import type React from "react"
import Link from "next/link"
import { AdminNav } from "@/components/admin/admin-nav"
import { UserNav } from "@/components/dashboard/user-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Corporate</span>
            <span>Perks</span>
            <span className="text-sm font-normal text-muted-foreground">Admin Portal</span>
          </Link>
          <UserNav />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <AdminNav />
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden py-6">{children}</main>
      </div>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Corporate Perks Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
