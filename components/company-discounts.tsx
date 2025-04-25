"use client"

import { ArrowRight, Gift } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const companies = [
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
    discount: "Up to 30% off on Office 365 and Surface devices",
    category: "Software & Hardware",
    width: 90,
    height: 18,
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png",
    discount: "20% off on Google Workspace and Pixel devices",
    category: "Software & Hardware",
    width: 100,
    height: 35,
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
    discount: "15% off on Prime membership and select products",
    category: "E-commerce",
    width: 100,
    height: 30,
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
    discount: "10% off on MacBooks and iPhones",
    category: "Hardware",
    width: 50,
    height: 60,
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
    discount: "25% off on Quest VR headsets",
    category: "Hardware",
    width: 100,
    height: 20,
  },
  {
    name: "IBM",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/2560px-IBM_logo.svg.png",
    discount: "20% off on cloud services and consulting",
    category: "Software & Services",
    width: 100,
    height: 30,
  },
]

export function CompanyDiscounts() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Exclusive Discounts from Our Partners
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Access special offers and discounts from our trusted partners.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Link
              key={company.name}
              href="/auth/register"
              className="group relative flex flex-col overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={company.logo}
                    alt={company.name}
                    fill
                    className="object-contain p-2 [filter:drop-shadow(0_0_12px_rgba(255,255,255,1))_drop-shadow(0_0_20px_rgba(255,255,255,0.8))_drop-shadow(0_0_30px_rgba(255,255,255,0.6))]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <p className="text-sm text-muted-foreground">{company.category}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2 text-primary">
                <Gift className="h-5 w-5" />
                <p className="font-medium">{company.discount}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Limited time offer</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 