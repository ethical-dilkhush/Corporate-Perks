"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RegisterForm } from "@/components/auth/register-form"
import { CompanyRegistrationForm } from "@/components/company/registration-form"
import { Building, User, Shield } from "lucide-react"
import { useState } from "react"

export default function RegisterPage() {
  const [role, setRole] = useState("employee")

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4 md:px-6">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your corporate email to register</p>
        </div>
        <Tabs defaultValue="employee" className="w-full" onValueChange={setRole}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Employee</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="employee">
            <RegisterForm role="employee" />
          </TabsContent>
          <TabsContent value="company">
            <CompanyRegistrationForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
