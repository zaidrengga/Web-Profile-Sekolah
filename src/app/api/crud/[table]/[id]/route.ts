import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

/**
 * GET by ID
 */
export async function GET(
    req: Request,
    context: { params: { table: string, id: string } }
) {
    const { table, id } = await context.params;

    try {
        const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * PATCH (update row)
 */
export async function PATCH(
    req: Request,
    context: { params: { table: string, id: string } }
) {
    const { table, id } = await context.params;

    try {
        const body = await req.json();
        const { data, error } = await supabase.from(table).update(body).eq("id", id);
        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * DELETE
 */
export async function DELETE(
    req: Request,
    { params }: { params: { table: string; id: string } }
) {
    const { table, id } = params;

    try {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}