import { CompanyNav } from "@/components/company/company-nav"

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <CompanyNav />
      <div className="flex-1">{children}</div>
    </div>
  )
} 