// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { supabase } from "@/lib/supabase/client"; // pastikan sudah ada supabase client di project

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // cek user di Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email, role, image, password")
      .eq("email", email)
      .eq("password", password) // ⚠️ ini plain text, sebaiknya pakai hashing bcrypt
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // buat token JWT
    const token = await new SignJWT({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      image: user.image,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(JWT_SECRET);

    // set cookie
    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}