import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { ProductReview } from "@/app/store/useStore";

// GET /api/reviews?product_id={id} - Get reviews for a product
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");

    if (!productId) {
      return NextResponse.json(
        { error: "product_id is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("product_reviews")
      .select(
        `
        *,
        user:profiles(name, email)
      `,
      )
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body: Omit<ProductReview, "id" | "created_at" | "updated_at"> =
      await request.json();

    // Validate rating
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    // Check if user has already reviewed this product
    const { data: existing } = await supabase
      .from("product_reviews")
      .select("id")
      .eq("product_id", body.product_id)
      .eq("user_id", body.user_id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 },
      );
    }

    // Insert review
    const { data: review, error: reviewError } = await supabase
      .from("product_reviews")
      .insert([body])
      .select()
      .single();

    if (reviewError) {
      return NextResponse.json({ error: reviewError.message }, { status: 400 });
    }

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
