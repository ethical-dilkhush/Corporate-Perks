import { HeroSection } from "@/components/hero-section"
import { CompanyDiscounts } from "@/components/company-discounts"
import { PartnersSection } from "@/components/partners-section"
import { FeaturesSection } from "@/components/features-section"
import { CTA } from "@/components/cta"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <CompanyDiscounts />
        <PartnersSection />
        <FeaturesSection />
        <CTA />
      </main>
    </div>
  )
}
