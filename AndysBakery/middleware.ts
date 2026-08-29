import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!sessionToken) {
    return new NextResponse("Admin session token is not configured", {
      status: 500,
    });
  }

  const adminCookie = request.cookies.get("andy_admin_session")?.value;

  if (adminCookie === sessionToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/orders/:path*"],
};