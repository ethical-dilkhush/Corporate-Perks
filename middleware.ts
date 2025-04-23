import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verify } from "jsonwebtoken"

export async function middleware(request: NextRequest) {
  // In development, bypass authentication
  if (process.env.NODE_ENV === "development") {
    // Add mock user info to request headers
    const requestHeaders = new Headers(request.headers)
    
    // Determine role based on path
    if (request.nextUrl.pathname.startsWith("/admin")) {
      requestHeaders.set("x-user-id", "admin@test.com")
      requestHeaders.set("x-user-role", "ADMIN")
    } else if (request.nextUrl.pathname.startsWith("/company")) {
      requestHeaders.set("x-user-id", "company@test.com")
      requestHeaders.set("x-user-role", "COMPANY")
    } else {
      requestHeaders.set("x-user-id", "employee@test.com")
      requestHeaders.set("x-user-role", "EMPLOYEE")
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // Check for auth token
  const token = request.cookies.get("auth-token")?.value

  // Public paths that don't require authentication
  const publicPaths = ["/", "/auth/login", "/auth/register", "/auth/verify-otp"]
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)

  if (!token && !isPublicPath) {
    // Redirect to login if no token and trying to access protected route
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (token) {
    try {
      // Verify token
      const secret = process.env.JWT_SECRET || "development-secret"
      const decoded = verify(token, secret) as { id: string; role: string }

      // Add user info to request headers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set("x-user-id", decoded.id)
      requestHeaders.set("x-user-role", decoded.role)

      // Check role-based access
      const adminPaths = ["/admin"]
      const companyPaths = ["/company"]
      const employeePaths = ["/dashboard"]

      const isAdminPath = adminPaths.some((path) => request.nextUrl.pathname.startsWith(path))
      const isCompanyPath = companyPaths.some((path) => request.nextUrl.pathname.startsWith(path))
      const isEmployeePath = employeePaths.some((path) => request.nextUrl.pathname.startsWith(path))

      // Redirect based on role
      if (isAdminPath && decoded.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      if (isCompanyPath && decoded.role !== "COMPANY") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      // Token is invalid or expired
      const response = NextResponse.redirect(new URL("/auth/login", request.url))

      // Clear the invalid token
      response.cookies.delete("auth-token")

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
