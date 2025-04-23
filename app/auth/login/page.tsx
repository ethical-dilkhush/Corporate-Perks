"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LoginForm } from "@/components/auth/login-form"
import { Building, User, Shield } from "lucide-react"
import { useState } from "react"

export default function LoginPage() {
  const [role, setRole] = useState("employee")

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
        </div>
        <Tabs defaultValue="employee" className="w-full" onValueChange={setRole}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Employee</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="employee">
            <LoginForm role="employee" />
          </TabsContent>
          <TabsContent value="company">
            <LoginForm role="company" />
          </TabsContent>
          <TabsContent value="admin">
            <LoginForm role="admin" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 