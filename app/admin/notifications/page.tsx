"use client"

import { Bell, Check, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    title: "New Company Registration",
    description: "Acme Corp has registered for Corporate Perks",
    type: "company",
    read: false,
    date: new Date("2024-03-20T10:00:00"),
  },
  {
    id: 2,
    title: "New Offer Added",
    description: "Amazon has added a new discount offer",
    type: "offer",
    read: false,
    date: new Date("2024-03-20T09:30:00"),
  },
  {
    id: 3,
    title: "User Feedback",
    description: "John Doe has submitted feedback about the platform",
    type: "feedback",
    read: true,
    date: new Date("2024-03-19T15:45:00"),
  },
  {
    id: 4,
    title: "System Update",
    description: "Platform maintenance scheduled for next week",
    type: "system",
    read: true,
    date: new Date("2024-03-19T14:20:00"),
  },
]

type FilterType = "all" | "unread" | "read" | "company" | "offer" | "feedback" | "system"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const toggleReadStatus = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: !notification.read } 
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        ({ ...notification, read: true })
      )
    )
  }

  const markAllAsUnread = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        ({ ...notification, read: false })
      )
    )
  }

  // Filter and sort notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = 
      filter === "all" || 
      (filter === "unread" && !notification.read) ||
      (filter === "read" && notification.read) ||
      (filter === notification.type)
    
    const matchesSearch = 
      searchQuery === "" ||
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFilter && matchesSearch
  })

  // Sort notifications: unread first, then by date
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (a.read !== b.read) {
      return a.read ? 1 : -1
    }
    return b.date.getTime() - a.date.getTime()
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-8 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("unread")}>
                Unread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("read")}>
                Read
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("company")}>
                Company
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("offer")}>
                Offers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("feedback")}>
                Feedback
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
            {unreadCount < notifications.length && (
              <Button variant="outline" onClick={markAllAsUnread}>
                Mark all as unread
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedNotifications.map((notification) => (
          <Card
            key={notification.id}
            className={cn(
              "transition-colors",
              !notification.read && "bg-muted/50"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">{notification.title}</CardTitle>
                <CardDescription>{notification.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{notification.type}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    notification.read && "text-green-500"
                  )}
                  title={notification.read ? "Read" : "Mark as read"}
                  onClick={() => toggleReadStatus(notification.id)}
                >
                  {notification.read && <Check className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(notification.date, { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 