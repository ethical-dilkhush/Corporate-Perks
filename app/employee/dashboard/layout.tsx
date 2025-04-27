import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default function EmployeeDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
} 