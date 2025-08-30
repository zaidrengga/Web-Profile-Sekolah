import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET by ID
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { table: string; id: string } }
) {
    const { table, id } = params; // tidak perlu await

    try {
        const { data, error } = await supabase
            .from(table)
            .select("*")
            .eq("id", id)
            .single();
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
    req: NextRequest,
    { params }: { params: { table: string; id: string } }
) {
    const { table, id } = params;

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
    req: NextRequest,
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
