import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NavWrapper } from "@/components/layout/nav-wrapper"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { EmployeeProvider } from "@/contexts/employee-context"
import { SupabaseListener } from "@/components/providers/supabase-listener"

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
          <EmployeeProvider>
            <SupabaseListener />
            <div className="flex min-h-screen flex-col">
              <NavWrapper />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster richColors position="top-center" />
          </EmployeeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
