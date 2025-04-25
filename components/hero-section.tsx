"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Gift, Shield, Users } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.05),transparent)]" />
      </div>

      {/* Animated circles */}
      <div className="absolute -z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.8, 0.5, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-black">
                Exclusive Corporate{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Discounts
                </span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Access special offers and discounts exclusively available to employees of partner companies.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4 min-[400px]:flex-row"
            >
              <Link href="/auth/register" className="w-full min-[400px]:w-auto">
                <Button size="lg" className="w-full group relative overflow-hidden">
                  <span className="relative z-10">Register with Corporate Email</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full min-[400px]:w-auto">
                <Button size="lg" variant="outline" className="w-full group">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap gap-6 pt-2"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground group">
                <Users className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>1000+ Companies</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground group">
                <Gift className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>5000+ Offers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground group">
                <Shield className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>Secure Platform</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 blur-2xl" />
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  alt="Corporate Perks Platform"
                  className="relative aspect-video w-full overflow-hidden rounded-xl object-cover object-center shadow-2xl"
                  src="/connected-perks.png"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
