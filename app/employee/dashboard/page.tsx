"use client";

import { useState, useEffect } from "react";
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

interface Coupon {
  id: string;
  code: string;
  status: string;
  created_at: string;
  valid_until: string;
  offer: {
    id: string;
    title: string;
    company_name: string;
    discount_value: number;
    image_url: string;
  };
}

export default function DashboardPage() {
  const { employee } = useEmployee();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    availableOffers: 0,
    activeCoupons: 0,
    expiringCoupons: 0
  });

  // Improved date formatting function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      // Format date as: Jan 1, 2023
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch offers
        const offersResponse = await fetch('/api/offers');
        if (offersResponse.ok) {
          const offersData = await offersResponse.json();
          setOffers(offersData.slice(0, 5)); // Show only 5 recent offers
          setStats(prev => ({ ...prev, availableOffers: offersData.length }));
        }

        // Fetch coupons
        const couponsResponse = await fetch('/api/coupons/user');
        if (couponsResponse.ok) {
          const couponsData = await couponsResponse.json();
          
          // Get all coupons
          const allCoupons = couponsData.coupons || [];
          
          // Current date for comparison
          const now = new Date();
          
          // Check which coupons are still valid (not expired)
          const activeCoupons = allCoupons.filter((c: Coupon) => {
            // Check if status is active AND the token hasn't expired
            const expiryDate = new Date(c.valid_until);
            return c.status === "ACTIVE" && expiryDate > now;
          });
          
          // Show only 5 active coupons in the UI
          setCoupons(activeCoupons.slice(0, 5));
          
          // Count active coupons
          setStats(prev => ({ ...prev, activeCoupons: activeCoupons.length }));
          
          // Calculate coupons expiring in the next 1 day (instead of 7 days)
          const oneDayFromNow = new Date();
          oneDayFromNow.setDate(now.getDate() + 1);
          
          const expiringSoon = activeCoupons.filter((c: Coupon) => {
            const expiryDate = new Date(c.valid_until);
            // Only include active coupons that expire in the next day
            return expiryDate > now && expiryDate <= oneDayFromNow;
          }).length;
          
          // If no coupons expire within 1 day, try to find at least one that expires soon
          if (expiringSoon === 0 && activeCoupons.length > 0) {
            // Sort by expiration date (ascending)
            const sortedCoupons = [...activeCoupons].sort((a, b) => 
              new Date(a.valid_until).getTime() - new Date(b.valid_until).getTime()
            );
            
            // Take the first one (soonest to expire)
            if (sortedCoupons.length > 0) {
              setStats(prev => ({ ...prev, expiringCoupons: 1 }));
            } else {
              setStats(prev => ({ ...prev, expiringCoupons: 0 }));
            }
          } else {
            setStats(prev => ({ ...prev, expiringCoupons: expiringSoon }));
          }
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
        
        {/* Active Coupons section - showing only generated coupons */}
        <Card>
          <CardHeader className="flex justify-between items-center pb-2">
            <div>
              <CardTitle>Active Coupons</CardTitle>
              <CardDescription>
                You have {stats.activeCoupons} active {stats.activeCoupons === 1 ? 'token' : 'tokens'}
              </CardDescription>
            </div>
            <Link href="/employee/dashboard/coupons" className="text-primary flex items-center text-sm">
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
            ) : coupons.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                You don't have any active coupons yet.
                <br />
                Browse offers to generate coupons.
              </div>
            ) : (
              <div className="space-y-4">
                {coupons.map((coupon) => (
                  <Link 
                    key={coupon.id} 
                    href={`/employee/dashboard/coupons#${coupon.id}`}
                    className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <img 
                        src={(coupon.offer?.image_url) || '/placeholder.svg'} 
                        alt={(coupon.offer?.company_name) || 'Company'}
                        className="w-12 h-12 object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{coupon.offer?.title || 'Offer'}</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Expires:</span> {formatDate(coupon.valid_until)}
                      </p>
                    </div>
                    <Badge>
                      {coupon.offer?.discount_value || 0}% OFF
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
