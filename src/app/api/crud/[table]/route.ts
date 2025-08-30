import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

/**
 * GET all data
 */
export async function GET(
    req: Request,
    context: { params: { table: string } }
) {
    const { table } = await context.params;

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
 * POST (create new row)
 */
export async function POST(
    req: Request,
    context: { params: { table: string } }
) {
    const { table } = await context.params;

    try {
        const body = await req.json();
        const { data, error } = await supabase.from(table).insert([body]);
        if (error) throw error;

        return NextResponse.json(data, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}