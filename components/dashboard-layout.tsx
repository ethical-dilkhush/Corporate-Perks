import { Header } from "@/components/header"
import { DashboardNav } from "@/components/dashboard-nav"

export function DashboardLayout({
  children,
  userType,
}: {
  children: React.ReactNode
  userType: "employee" | "company" | "admin"
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <div className="flex h-full flex-col gap-2 p-4">
            <DashboardNav userType={userType} />
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
} 