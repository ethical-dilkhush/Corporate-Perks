import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { CompaniesTable } from "@/components/admin/companies-table"

export default function AdminCompaniesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
          <p className="text-muted-foreground">Manage registered companies</p>
        </div>
        <Link href="/admin/companies/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search companies..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <CompaniesTable />
    </div>
  )
}
