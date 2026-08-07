import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getGalleries } from "@/lib/galleries";
import { requireAdmin } from "@/lib/require-admin";
import type { Gallery } from "@/app/store/useStore";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;

    const data = await getGalleries({ category });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return guard.response;

    const body: Omit<Gallery, "id" | "created_at" | "updated_at"> =
      await request.json();

    const { data, error } = await guard.supabase
      .from("galleries")
      .insert([body])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
