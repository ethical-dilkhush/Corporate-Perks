import { HeroSection } from "@/components/hero-section"
import { CompanyDiscounts } from "@/components/company-discounts"
import { PartnersSection } from "@/components/partners-section"
import { FeaturesSection } from "@/components/features-section"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <HeroSection />
        <CompanyDiscounts />
        <PartnersSection />
        <FeaturesSection />
      </main>
    </div>
  )
} 