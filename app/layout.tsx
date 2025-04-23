import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NavWrapper } from "@/components/layout/nav-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Corporate Perks",
  description: "Exclusive discounts and benefits for employees",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NavWrapper />
        <main>{children}</main>
      </body>
    </html>
  )
}
