import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for recent companies
const recentCompanies = [
  {
    id: "1",
    name: "TechGadgets Inc.",
    status: "APPROVED",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "CloudSoft Solutions",
    status: "PENDING",
    createdAt: "2025-01-20",
  },
  {
    id: "3",
    name: "Green Energy Co.",
    status: "APPROVED",
    createdAt: "2025-01-18",
  },
]

export function RecentCompanies() {
  return (
    <div className="space-y-4">
      {recentCompanies.map((company) => (
        <div key={company.id} className="flex flex-col space-y-2 rounded-lg border p-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{company.name}</h3>
              <p className="text-sm text-muted-foreground">
                Created on {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Badge
              variant={
                company.status === "APPROVED" ? "default" : company.status === "PENDING" ? "outline" : "destructive"
              }
            >
              {company.status}
            </Badge>
          </div>
          <div className="flex items-center justify-end">
            <Link href={`/admin/companies/${company.id}`}>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
