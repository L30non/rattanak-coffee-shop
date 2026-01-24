import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/client";
import type { Order } from "@/app/store/useStore";

const supabase = createClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    let query = supabase.from("orders").select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price,
          created_at
        )
      `);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

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

export async function POST(request: NextRequest) {
  try {
    const body: Omit<Order, "id" | "created_at"> & {
      items?: Array<{ product_id: string; quantity: number; price: number }>;
    } = await request.json();
    const { items, ...orderData } = body;

    // Insert order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    // Insert order items if provided
    if (items && items.length > 0) {
      const orderItems = items.map((item) => ({
        order_id: order.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        return NextResponse.json(
          { error: itemsError.message },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
