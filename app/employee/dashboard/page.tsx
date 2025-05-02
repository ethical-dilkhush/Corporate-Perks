"use client";

import { useState, useEffect, use } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import { useEmployee } from "@/contexts/employee-context";
import Link from "next/link";
import { ArrowRight, Gift, ExternalLink, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define interfaces for our data
interface Offer {
  id: string;
  title: string;
  company_name: string;
  description: string;
  discount_value: number;
  valid_until: string;
  category: string;
  image_url: string;
  validUntilFormatted: string;
}

export default function DashboardPage() {
  const { employee } = useEmployee();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    availableOffers: 0,
    activeCoupons: 0,
    expiringCoupons: 0
  });


  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch offers
        const offersResponse = await fetch('/api/offers');
        if (offersResponse.ok) {
          const offersData = await offersResponse.json();
          setOffers(offersData.slice(0, 5)); 
          setStats(prev => ({ ...prev, availableOffers: offersData.length }));
        }
      
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
        Welcome back, {employee?.name || "loading..."}! Here's an overview of your perks.

        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Offers</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats.availableOffers}
            </div>
            <p className="text-xs text-muted-foreground">Exclusive discounts waiting for you</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tokens</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats.activeCoupons}
            </div>
            <p className="text-xs text-muted-foreground">Valid discount tokens you can use</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats.expiringCoupons}
            </div>
            <p className="text-xs text-muted-foreground">Tokens expiring within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Recent Offers */}
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <div>
              <CardTitle>Recent Offers</CardTitle>
              <CardDescription>Latest discounts available for you</CardDescription>
            </div>
            <Link href="/employee/dashboard/offers" className="text-primary flex items-center text-sm">
              View all <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16 ml-auto" />
                  </div>
                ))}
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                No offers available at the moment.
              </div>
            ) : (
              <div className="space-y-4">
                {offers.map((offer) => (
                  <Link 
                    key={offer.id} 
                    href={`/employee/dashboard/offers#${offer.id}`}
                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src={offer.image_url || '/placeholder.svg'} 
                        alt={offer.company_name}
                        className="w-12 h-12 object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{offer.title}</p>
                      <p className="text-xs text-muted-foreground">{offer.company_name}</p>
                    </div>
                    <Badge variant="secondary">
                      {offer.discount_value}% OFF
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <div>
              <CardTitle>Active Coupons</CardTitle>
              <CardDescription>
                You have {stats.activeCoupons} active coupons
              </CardDescription>
            </div>
        
          </CardHeader>
        </Card>
        
      </div>
    </div>
  )
}
