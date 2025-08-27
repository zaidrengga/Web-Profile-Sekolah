"use server";

import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;

export async function postLogin(email: string, password: string) {
    const cookieStore = await cookies();
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .eq("password", password)
            .single();

        if (error || !data) throw error;

        const token = jwt.sign(
            { id: data.id, username: data.username, email: data.email, role: data.role, image: data.image },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        cookieStore.set("token", token, {
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
        });

        return data
    } catch (err) {
        console.log("postLogin error:", err);
        return null;
    }
}

export async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        console.log("getUser error:", err);
        return null;
    }
}

export async function logoutCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}