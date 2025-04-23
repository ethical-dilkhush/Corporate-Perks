import { CouponsList } from "@/components/dashboard/coupons-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CouponsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Coupons</h1>
        <p className="text-muted-foreground">Manage your generated discount coupons</p>
      </div>
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="used">Used</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <CouponsList status="active" />
        </TabsContent>
        <TabsContent value="used" className="mt-4">
          <CouponsList status="used" />
        </TabsContent>
        <TabsContent value="expired" className="mt-4">
          <CouponsList status="expired" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
