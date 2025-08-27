"use server"

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // kalau tidak ada token dan masuk ke /dashboard → redirect ke login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // kalau ada token
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);

      // kalau user sudah login tapi buka /login → redirect ke dashboard
      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch {
      // token invalid → hapus cookie + redirect login
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("token", "", { maxAge: -1 });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
