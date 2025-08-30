import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { nama, email, subject, message } = await req.json();

    if (!nama || !email || !message) {
      return NextResponse.json({ error: "Nama, email, dan message wajib diisi" }, { status: 400 });
    }

    const { error } = await supabase.from("contacts").insert({
      nama,
      email,
      subject: subject || null,
      message,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Gagal menyimpan pesan" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
