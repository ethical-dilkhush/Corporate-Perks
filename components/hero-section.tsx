"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <Sparkles className="h-6 w-6 text-primary/30" />
          </motion.div>
        ))}
      </div>

      <div className="container relative mx-auto px-4 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left column */}
          <div className="flex flex-col items-start justify-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center rounded-full border bg-muted px-4 py-1.5 text-sm font-medium">
                <Star className="mr-2 h-4 w-4 text-primary" />
                <span>Exclusive Employee Benefits</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Unlock Your{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Corporate Perks
                </span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Access exclusive discounts, benefits, and rewards curated just for you. 
                Your gateway to premium employee benefits starts here.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button asChild size="lg" className="group">
                <Link href="/employee/dashboard">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/employee/login">Sign In</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {[
                "Exclusive Discounts",
                "Premium Benefits",
                "Easy Access",
                "24/7 Support",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full bg-muted px-4 py-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8">
              <div className="absolute inset-0 rounded-2xl border border-primary/10" />
              <div className="absolute inset-4 rounded-xl border border-primary/5" />
              
              {/* Image with Enhanced Effects */}
              <motion.div
                className="relative h-full w-full overflow-hidden rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
                <Image
                  src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
                  alt="Corporate perks illustration"
                  width={500}
                  height={400}
                  className="h-72 md:h-[400px] w-full md:w-[500px] rounded-3xl object-cover transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-2"
                  >
                    <h3 className="text-xl font-semibold">Premium Benefits</h3>
                    <p className="text-sm opacity-90">Exclusive access to curated perks</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating discount badge */}
              <motion.div
                className="absolute -right-4 -top-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                NEW
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
