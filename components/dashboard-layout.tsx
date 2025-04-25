import { EmployeeNav } from "@/components/employee-nav"

export function DashboardLayout({
  children,
  userType,
}: {
  children: React.ReactNode
  userType: "employee" | "company" | "admin"
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {userType === "employee" && <EmployeeNav />}
      <main className="flex-1">{children}</main>
    </div>
  )
} 