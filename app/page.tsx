import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { PartnersSection } from "@/components/partners-section"
import { ArrowRight, Gift, Shield, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary p-2">
                  <Gift className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-1 font-bold text-xl">
                  <span className="text-primary">Corporate</span>
                  <span>Perks</span>
                </div>
              </div>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="font-medium">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PartnersSection />
        <section className="w-full py-12 md:py-24 bg-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Get Started?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join thousands of employees who are already enjoying exclusive corporate benefits.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="group">
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div className="flex items-center gap-1 font-bold text-xl">
                  <span className="text-primary">Corporate</span>
                  <span>Perks</span>
                </div>
              </div>
            </Link>
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </Link>
            </nav>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Corporate Perks Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
