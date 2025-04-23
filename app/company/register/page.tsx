import { CompanyRegistrationForm } from "@/components/company/registration-form"

export default function CompanyRegistrationPage() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Register Your Company</h1>
        <p className="text-muted-foreground">
          Join our platform to offer exclusive discounts to employees of partner companies.
        </p>
      </div>
      <CompanyRegistrationForm />
    </div>
  )
}
