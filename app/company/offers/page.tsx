import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import { OffersTable } from "@/components/company/offers-table"

export default function CompanyOffersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Offers</h1>
          <p className="text-muted-foreground">Create and manage your discount offers</p>
        </div>
        <Link href="/company/offers/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New Offer
          </Button>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search offers..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>
      <OffersTable />
    </div>
  )
}
