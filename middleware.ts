// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Only check for a cookie or header — no crypto, no DB calls
  const session = req.cookies.get("session")

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Allow request to proceed
  return NextResponse.next()
}

// Protect only certain routes
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
}
