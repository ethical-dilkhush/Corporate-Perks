import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    const secret = process.env.JWT_SECRET || "development-secret"
    const decoded = verify(token, secret)

    // Add user info to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", (decoded as any).id)
    requestHeaders.set("x-user-role", (decoded as any).role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    // Token is invalid or expired
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/company/:path*",
    "/admin/:path*",
    "/api/dashboard/:path*",
    "/api/company/:path*",
    "/api/admin/:path*",
  ],
}
