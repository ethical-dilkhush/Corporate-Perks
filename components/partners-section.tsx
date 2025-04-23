"use client";

import { motion } from "framer-motion"

const partners = [
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
  },
]

export function PartnersSection() {
  return (
    <section className="w-full py-12 md:py-24 bg-slate-50/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Our Partner Companies
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Join these leading technology companies who trust us with their employee benefits.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 pt-12 md:grid-cols-3 lg:grid-cols-6">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center rounded-lg bg-white p-6 transition-all hover:shadow-lg"
            >
              <div className="relative h-12 w-full">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-full w-full object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            * These are example partner companies. Actual partnerships may vary.
          </p>
        </div>
      </div>
    </section>
  )
} 