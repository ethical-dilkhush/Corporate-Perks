"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FeaturesSection } from "@/components/features-section";
import { PartnersSection } from "@/components/partners-section";
import { Sparkles, Gift, ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";
import Image from "next/image";

// =============================================
// Mock Data Section
// =============================================
const offers = [
  {
    id: "1",
    title: "20% off at TechGadgets",
    company: "TechGadgets Inc.",
    description: "Get 20% off on all electronics and accessories",
    discountValue: 20,
    validUntil: "2025-06-30",
    category: "Electronics",
    image: "/modern-electronics-retail.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    validUntilFormatted: "6/30/2025"
  },
  {
    id: "2",
    title: "50% off Premium Coffee",
    company: "BeanBrew Coffee",
    description: "Enjoy premium coffee at half the price",
    discountValue: 50,
    validUntil: "2025-05-15",
    category: "Food & Beverage",
    image: "/cozy-corner-cafe.png",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    id: "3",
    title: "15% off Office Supplies",
    company: "OfficeMax",
    description: "Save on all office essentials",
    discountValue: 15,
    validUntil: "2025-07-01",
    category: "Office Supplies",
    image: "/placeholder.svg",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
];

// =============================================
// Main Component
// =============================================
export default function EmployeeHomePage() {
  const employeeName = "Employee Name";
  const [year, setYear] = useState<string>("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* =============================================
            Hero Welcome Section
            ============================================= */}
        <section className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-primary/5 via-background/50 to-background dark:from-primary/10 dark:via-background/80 dark:to-background py-12 px-0">
          {/* Hero Image Section */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <Image
              src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
              alt="Corporate perks illustration"
              width={500}
              height={400}
              className="object-cover h-72 md:h-[400px] w-full md:w-[500px] rounded-none"
              priority
            />
          </div>
          
          {/* Hero Text Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4 px-4 md:px-16">
            <h1 className="text-4xl md:text-6xl font-extrabold text-foreground drop-shadow">
              Hi {employeeName}
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Welcome to the <span className="text-foreground">Corporate Offers Portal!</span>
            </h2>
            <p className="text-lg md:text-xl text-foreground">
              Explore exclusive discounts specially curated for you by our partner companies.
              <br />
              Start saving today — browse available offers and generate your unique coupons!
            </p>
            <p className="text-lg font-semibold text-foreground mt-2">
              Let&apos;s make the most of these benefits together.
            </p>
          </div>
        </section>

        {/* =============================================
            Featured Offers Section
            ============================================= */}
        <section className="container mx-auto px-4 md:px-6 py-12 bg-background">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center text-foreground mb-4">
              Exclusive Discounts from Our Partners
            </h2>
            <Link href="/employee/dashboard/offers">
              <Button variant="outline" className="flex items-center gap-2">
                View All Offers
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <Link 
                key={offer.id} 
                href={`/employee/dashboard/offers#${offer.id}`}
                className="block"
              >
                <div
                  className="bg-card rounded-xl border border-border p-6 flex flex-col justify-between min-h-[220px] hover:shadow transition cursor-pointer"
                >
                  {/* Offer Header */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <img src={offer.image} alt={offer.company} className="w-12 h-12 object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-foreground">{offer.company}</div>
                      <div className="text-sm text-muted-foreground">{offer.category}</div>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="flex items-center gap-2 mt-2 mb-2">
                    <Gift className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground text-base">{offer.title}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{offer.description}</div>

                  {/* Offer Footer */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-muted-foreground">
                      Valid until {offer.validUntilFormatted}
                    </span>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* =============================================
            Partners Showcase Section
            ============================================= */}
        <PartnersSection />

        {/* =============================================
            Features Highlight Section
            ============================================= */}
        <FeaturesSection />
      </main>
      
      {/* =============================================
          Footer Section
          ============================================= */}
      <Footer />
    </div>
  );
} 