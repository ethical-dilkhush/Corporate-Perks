"use client"

import { usePathname } from "next/navigation"
import { MainNav } from "./main-nav"

export function NavWrapper() {
  const pathname = usePathname()

  // Only show MainNav if not in dashboard, company, admin, or employee sections
  const showMainNav = !pathname?.startsWith('/dashboard') && 
                     !pathname?.startsWith('/company') && 
                     !pathname?.startsWith('/admin') &&
                     !pathname?.startsWith('/employee')

  return showMainNav ? <MainNav /> : null
} 