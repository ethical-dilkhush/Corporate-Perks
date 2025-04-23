"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag } from "lucide-react"

// Mock data for redemption history
const history = [
  {
    id: "1",
    offerId: "1",
    title: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    discountValue: 20,
    redeemedAt: "2024-04-20T14:30:00Z",
    status: "success",
  },
  {
    id: "2",
    offerId: "2",
    title: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    discountValue: 50,
    redeemedAt: "2024-04-18T10:15:00Z",
    status: "success",
  },
  {
    id: "3",
    offerId: "3",
    title: "15% off Office Supplies",
    company: "OfficeMax",
    discountValue: 15,
    redeemedAt: "2024-04-15T16:45:00Z",
    status: "failed",
  },
]

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Redemption History</h1>
        <p className="text-sm text-muted-foreground">Track your coupon redemptions and status</p>
      </div>

      <div className="grid gap-4">
        {history.length > 0 ? (
          history.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.company}</CardDescription>
                  </div>
                  <Badge variant="secondary">{item.discountValue}% OFF</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(item.redeemedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(item.redeemedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="h-4 w-4" />
                    <Badge
                      variant="outline"
                      className={
                        item.status === "success"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }
                    >
                      {item.status === "success" ? "Successfully Redeemed" : "Redemption Failed"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No redemption history to display.</p>
          </div>
        )}
      </div>
    </div>
  )
}
