import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = cookies()
  const response = NextResponse.json({ success: true })

  // Clear all auth-related cookies
  response.cookies.delete("auth-token")
  response.cookies.delete("session")
  response.cookies.delete("employee-email")
  response.cookies.delete("employee-id")
  
  // Set cookies to expire immediately
  const cookieOptions = {
    expires: new Date(0),
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    httpOnly: true
  }

  // Ensure cookies are cleared from the cookie store as well
  cookieStore.getAll().forEach(cookie => {
    if (cookie.name.startsWith('auth-') || 
        cookie.name.startsWith('session') || 
        cookie.name.includes('employee')) {
      response.cookies.delete(cookie.name)
    }
  })

  return response
}
