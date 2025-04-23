"use client";

import { CheckCircle2, Gift, Shield, Users } from "lucide-react"

const features = [
  {
    title: "Exclusive Discounts",
    description: "Access special offers and discounts from top brands exclusively for corporate employees.",
    icon: Gift,
  },
  {
    title: "Verified Companies",
    description: "Only employees from verified partner companies can access these exclusive benefits.",
    icon: Shield,
  },
  {
    title: "Easy Registration",
    description: "Quick and simple registration process using your corporate email address.",
    icon: Users,
  },
  {
    title: "Secure Platform",
    description: "Your data is protected with enterprise-grade security measures.",
    icon: CheckCircle2,
  },
]

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Why Choose Corporate Perks?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Discover the benefits of being part of our exclusive corporate perks platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pt-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative flex flex-col items-start rounded-lg border bg-background p-6 transition-all hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 