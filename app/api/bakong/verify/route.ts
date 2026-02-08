import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyBakongPayment } from "@/lib/bakong";

// Force dynamic rendering - prevents caching in production
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { md5 } = body as { md5: string };

    console.log(
      "[Bakong API] Received verification request for md5:",
      md5?.substring(0, 10) + "...",
    );

    if (!md5) {
      return NextResponse.json({ error: "Missing md5 hash" }, { status: 400 });
    }

    const result = await verifyBakongPayment(md5);

    console.log("[Bakong API] Returning result:", JSON.stringify(result));

    return NextResponse.json(result);
  } catch (err) {
    console.error("[Bakong API] Error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to verify Bakong payment",
      },
      { status: 500 },
    );
  }
}
