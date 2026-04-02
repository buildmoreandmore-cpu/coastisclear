import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/search"];
const publicRoutes = ["/", "/about", "/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API routes
  if (
    publicRoutes.some((r) => pathname === r) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if route needs protection
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));
  if (!isProtected) return NextResponse.next();

  // Check for Supabase auth
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  const supabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // Read the access token from cookies
  const accessToken =
    request.cookies.get("sb-ossftvmqtybwcyzdutug-auth-token")?.value;

  if (!accessToken) {
    // Try the standard Supabase cookie format
    const allCookies = request.cookies.getAll();
    const sbCookie = allCookies.find((c) =>
      c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
    );

    if (!sbCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/search/:path*"],
};
