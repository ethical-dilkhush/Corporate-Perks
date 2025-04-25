import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NavWrapper } from "@/components/layout/nav-wrapper"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <NavWrapper />
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  )
}
