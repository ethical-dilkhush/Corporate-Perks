import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function RegistrationConfirmationPage() {
  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Registration Submitted</CardTitle>
          <CardDescription>Your company registration is pending approval</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for registering your company with Corporate Perks Platform. Our team will review your application
            and get back to you within 2-3 business days.
          </p>
          <p className="text-sm text-muted-foreground">
            You will receive an email notification once your registration is approved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
