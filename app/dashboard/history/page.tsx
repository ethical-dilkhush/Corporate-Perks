import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistoryList } from "@/components/dashboard/history-list"

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Redemption History</h1>
        <p className="text-muted-foreground">View your coupon redemption history</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coupon History</CardTitle>
          <CardDescription>Track all your coupon activities</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="redeemed">Redeemed</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <HistoryList filter="all" />
            </TabsContent>
            <TabsContent value="redeemed" className="mt-4">
              <HistoryList filter="redeemed" />
            </TabsContent>
            <TabsContent value="expired" className="mt-4">
              <HistoryList filter="expired" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
