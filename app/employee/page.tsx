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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEmployee } from "@/contexts/employee-context";

interface Offer {
  id: string;
  title: string;
  company_name: string;
  description: string;
  discount_value: number;
  valid_until: string;
  category: string;
  image_url: string;
  company_logo: string;
  validUntilFormatted: string;
}

interface Employee {
  id: string;
  email: string;
  name: string;
}

export default function EmployeeHomePage() {
  const { employee, loading } = useEmployee();
  const [year, setYear] = useState<string>("");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
    fetchOffers();
  }, []);


  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/offers');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      
      }
      const data = await response.json();
      setOffers(data);
    } catch (error) {
      toast.error('Failed to load offers');
      console.error('Error fetching offers:', error);
    } finally {
      setOffersLoading(false);
    }
  };


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
            <div className="min-h-[4rem]"> {/* Fixed height container for smooth transition */}
              {loading ? (
                <div className="h-12 w-48 bg-muted animate-pulse rounded-lg"></div>
              ) : (
                <h1 className="text-4xl md:text-6xl font-extrabold text-foreground drop-shadow animate-fade-in">
                  Hi {employee?.name}
                </h1>
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              the <span className="text-foreground">Corporate Offers Portal!</span>
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
          
          {offersLoading ? (
            <div className="text-center py-8">Loading offers...</div>
          ) : offers.length === 0 ? (
            <div className="text-center py-8">No offers available at the moment.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offers
                .slice()
                .sort((a, b) => new Date(b.valid_until).getTime() - new Date(a.valid_until).getTime())
                .slice(0, 3)
                .map((offer) => (
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
                          <img 
                            src={offer.image_url || '/placeholder.svg'} 
                            alt={offer.company_name} 
                            className="w-12 h-12 object-cover" 
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-lg text-foreground">{offer.company_name}</div>
                          <div className="text-sm text-muted-foreground">{offer.category}</div>
                        </div>
                        <Badge variant="secondary" className="text-lg font-semibold">
                          {offer.discount_value}% OFF
                        </Badge>
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
          )}
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