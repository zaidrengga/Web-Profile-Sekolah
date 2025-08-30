// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Kalau tidak ada token & akses dashboard → redirect login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Kalau ada token, cek validitas
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);

      // Jika sudah login tapi buka /login → redirect ke dashboard
      if (pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch {
      // Token invalid → hapus cookie & redirect login
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0,
      });
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
