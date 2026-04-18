import { auth } from "@/lib/auth/config"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth
  const isAdmin = req.auth?.user?.isAdmin || false

  // Protected user routes
  const isUserRoute = pathname.startsWith("/dashboard")

  // Protected admin routes
  const isAdminRoute = pathname.startsWith("/admin")

  // Auth pages
  const isAuthPage = pathname.startsWith("/auth")

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Protect user dashboard routes
  if (isUserRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Protect admin routes - require both auth and admin role
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
