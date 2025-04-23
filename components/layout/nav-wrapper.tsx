"use client"

import { usePathname } from "next/navigation"
import { MainNav } from "./main-nav"

export function NavWrapper() {
  const pathname = usePathname()

  // Only show MainNav if not in dashboard, company, or admin sections
  const showMainNav = !pathname?.startsWith('/dashboard') && 
                     !pathname?.startsWith('/company') && 
                     !pathname?.startsWith('/admin')

  return showMainNav ? <MainNav /> : null
} 