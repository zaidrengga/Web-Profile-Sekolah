import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET: ambil semua data atau satu data berdasarkan id
 * Query: /api/crud?table=contacts&id=123
 */
export async function GET(req: Request) {
    const url = new URL(req.url);
    const table = url.searchParams.get("table");
    if (!table) return NextResponse.json({ error: "table is required" }, { status: 400 });

    try {
        const { data, error } = await supabase.from(table).select("*");
        if (error) throw error;
        return NextResponse.json(data);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * POST: buat data baru
 * Body JSON: { "table": "contacts", "data": { "nama": "Zaid", "email": "zaid@example.com" } }
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { table, data } = body;

        if (!table || !data) {
            return NextResponse.json({ error: "Table and data are required" }, { status: 400 });
        }

        const { data: inserted, error } = await supabase.from(table).insert([data]);
        if (error) throw error;

        return NextResponse.json(inserted, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * PATCH: update data
 * Body JSON: { "table": "contacts", "id": "abc123", "data": { "nama": "Zaid R." } }
 */
export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { table, id, data } = body;

        if (!table || !id || !data) {
            return NextResponse.json({ error: "Table, id and data are required" }, { status: 400 });
        }

        const { data: updated, error } = await supabase.from(table).update(data).eq("id", id);
        if (error) throw error;

        return NextResponse.json(updated);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * DELETE: hapus data
 * Body JSON: { "table": "contacts", "id": "abc123" }
 */
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const { table, id } = body;

        if (!table || !id) {
            return NextResponse.json({ error: "Table and id are required" }, { status: 400 });
        }

        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
