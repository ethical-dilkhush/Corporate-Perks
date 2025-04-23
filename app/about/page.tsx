import { Building2, Users, Gift, BarChart3, Shield, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-primary/5">
        <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              About Corporate Perks
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Empowering companies to provide exclusive benefits to their employees through curated partnerships with top vendors.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                At Corporate Perks, we believe that employee satisfaction is the cornerstone of business success. Our mission is to bridge the gap between companies and premium vendors, creating a win-win ecosystem where everyone benefits.
              </p>
              <div className="grid gap-6 pt-6 sm:grid-cols-2">
                <div className="rounded-lg border p-6">
                  <Heart className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold">Employee Happiness</h3>
                  <p className="mt-2 text-muted-foreground">
                    Enhancing workplace satisfaction through exclusive benefits
                  </p>
                </div>
                <div className="rounded-lg border p-6">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold">Trusted Partnerships</h3>
                  <p className="mt-2 text-muted-foreground">
                    Curated selection of premium vendors and services
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/team-meeting.jpg"
                alt="Professional team meeting in a modern office"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-background p-6 text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold">500+</div>
              <p className="text-muted-foreground">Partner Companies</p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold">1M+</div>
              <p className="text-muted-foreground">Active Employees</p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold">1000+</div>
              <p className="text-muted-foreground">Exclusive Deals</p>
            </div>
            <div className="rounded-lg border bg-background p-6 text-center">
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold">50+</div>
              <p className="text-muted-foreground">Industries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-12">How It Works</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="space-y-4">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold">Company Partnership</h3>
                <p className="text-muted-foreground">
                  Companies join our platform to provide benefits to their employees
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold">Employee Access</h3>
                <p className="text-muted-foreground">
                  Employees get instant access to exclusive discounts and benefits
                </p>
              </div>
              <div className="space-y-4">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold">Enjoy Benefits</h3>
                <p className="text-muted-foreground">
                  Start saving on products and services from premium vendors
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of companies who are already providing exclusive benefits to their employees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              >
                Get Started
              </a>
              <a
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 