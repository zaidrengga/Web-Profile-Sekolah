import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Kalau buka bukan homepage, redirect ke homepage
  if (url.pathname !== "/") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Middleware aktif untuk semua route, kecuali file internal Next.js & API
export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)"],
};
