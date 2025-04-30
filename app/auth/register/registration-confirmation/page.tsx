import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function RegistrationConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl p-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Registration Submitted</CardTitle>
            <CardDescription className="text-lg">
              Thank you for submitting your company registration request
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4">
              <p className="text-gray-600">
                Your company registration request has been submitted for review. Our team will review your application and notify you via email once it's approved.
              </p>
              <p className="text-gray-600">
                The approval process typically takes 1-2 business days. Once approved, you'll be able to log in to your company dashboard using the email and password you provided during registration.
              </p>
            </div>
            <div className="pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 