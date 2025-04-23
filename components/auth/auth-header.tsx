"use client"

import Link from "next/link"
import { Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function AuthHeader() {
  const pathname = usePathname()
  const isLoginPage = pathname === "/auth/login"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-2">
                <Gift className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-1 font-bold text-xl">
                <span className="text-primary">Corporate</span>
                <span>Perks</span>
              </div>
            </div>
          </Link>
          <Link href={isLoginPage ? "/auth/register" : "/auth/login"}>
            <Button variant="ghost">
              {isLoginPage ? "Sign Up" : "Sign In"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
} 