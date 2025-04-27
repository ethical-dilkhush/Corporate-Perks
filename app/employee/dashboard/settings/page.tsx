"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell, Mail, Shield, User } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="flex gap-2">
                <Input id="name" placeholder="John Doe" />
                <Button variant="outline">Update</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input id="email" type="email" placeholder="john@example.com" />
                <Button variant="outline">Update</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Manage how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive instant updates about new offers and coupons
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Get updates about new features and promotions
                </p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Button variant="outline" className="h-auto py-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Account Details</div>
                <div className="text-sm text-muted-foreground">View and edit your account information</div>
              </div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-6">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Notification Settings</div>
                <div className="text-sm text-muted-foreground">Manage your notification preferences</div>
              </div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Email Preferences</div>
                <div className="text-sm text-muted-foreground">Control your email subscriptions</div>
              </div>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-6">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Privacy Settings</div>
                <div className="text-sm text-muted-foreground">Manage your privacy and data</div>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
} 