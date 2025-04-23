import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { AdminOffersTable } from "@/components/admin/admin-offers-table"

export default function AdminOffersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
        <p className="text-muted-foreground">Manage discount offers</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search offers..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <AdminOffersTable />
    </div>
  )
}
