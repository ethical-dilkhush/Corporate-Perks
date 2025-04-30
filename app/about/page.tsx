import { Building2, Users, Gift, BarChart3, Shield, Heart } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Combined Hero and Mission Section with Continuous Gradient */}
      <div className="relative overflow-hidden">
        {/* Main gradient background spanning both sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 via-gray-700 via-gray-500 via-gray-300 to-white" />
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
        
        {/* Grid pattern with reduced opacity */}
        <div className="absolute inset-0 bg-grid-black/[0.05] bg-[size:30px_30px]" />
        
        {/* Subtle shine effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />

        {/* Hero Section */}
        <section className="relative py-20 md:py-32">
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white drop-shadow-lg">
                About Corporate Perks
              </h1>
              <p className="mt-6 text-lg text-white/90 md:text-xl leading-relaxed">
                Empowering companies to provide exclusive benefits to their employees through curated partnerships with top vendors.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="relative py-20">
          <div className="container relative mx-auto px-4">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Our Mission</h2>
                <p className="text-lg text-white/90">
                  At Corporate Perks, we believe that employee satisfaction is the cornerstone of business success. Our mission is to bridge the gap between companies and premium vendors, creating a win-win ecosystem where everyone benefits.
                </p>
                <div className="grid gap-6 pt-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <Heart className="h-8 w-8 text-white mb-4" />
                    <h3 className="text-xl font-semibold text-white">Employee Happiness</h3>
                    <p className="mt-2 text-black">
                      Enhancing workplace satisfaction through exclusive benefits
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <Shield className="h-8 w-8 text-white mb-4" />
                    <h3 className="text-xl font-semibold text-white">Trusted Partnerships</h3>
                    <p className="mt-2 text-black">
                      Curated selection of premium vendors and services
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden group">
                <Image
                  src="/team-meeting.jpg"
                  alt="Professional team meeting in a modern office"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={90}
                />
              </div>
            </div>
          </div>
        </section>
      </div>

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

    </div>
  )
} 