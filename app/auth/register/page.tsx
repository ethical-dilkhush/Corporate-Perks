import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RegisterForm } from "@/components/auth/register-form"
import { Building, User, Shield } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-8">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your corporate email to register</p>
        </div>
        <Tabs defaultValue="employee" className="w-full">
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
        </Tabs>
        <RegisterForm />
      </div>
    </div>
  )
}
