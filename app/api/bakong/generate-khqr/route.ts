import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateBakongKHQR } from "@/lib/bakong";

// Force dynamic rendering - prevents caching
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, billNumber } = body as {
      amount: number;
      billNumber?: string;
    };

    // Round to 2 decimal places to avoid floating-point issues
    const sanitizedAmount = Math.round(Number(amount) * 100) / 100;

    if (!sanitizedAmount || isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Amount must be a positive number." },
        { status: 400 },
      );
    }

    const result = generateBakongKHQR(sanitizedAmount, billNumber);

    return NextResponse.json(result);
  } catch (err) {
    console.error("KHQR generation error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to generate KHQR code",
      },
      { status: 500 },
    );
  }
}
