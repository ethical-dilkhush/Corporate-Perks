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
import { UserNav } from "@/components/user-nav";

// Mock offers data
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", // Example logo
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", // Example logo
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
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", // Example logo
  },
];

export default function EmployeeHomePage() {
  const employeeName = "Employee Name";
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1">
        {/* Welcome Section */}
        <section className="w-full min-h-[60vh] flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 py-12 px-0">
          {/* Left: Illustration (full height on desktop) */}
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
          {/* Right: Welcome Text */}
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

        {/* Offers Section */}
        <section className="container mx-auto px-4 md:px-6 py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
            Exclusive Discounts from Our Partners
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-between min-h-[220px] hover:shadow transition"
              >
                {/* Top: Image in Circle and Company */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={offer.image} alt={offer.company} className="w-12 h-12 object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-foreground">{offer.company}</div>
                    <div className="text-sm text-muted-foreground">{offer.category}</div>
                  </div>
                </div>
                {/* Offer Title */}
                <div className="flex items-center gap-2 mt-2 mb-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground text-base">{offer.title}</span>
                </div>
                {/* Description */}
                <div className="text-sm text-muted-foreground mb-2">{offer.description}</div>
                {/* Note and Arrow */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">
                    Valid until {offer.validUntilFormatted}
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners Section */}
        <PartnersSection />

        {/* Features Section */}
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
} 