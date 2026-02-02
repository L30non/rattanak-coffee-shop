import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Order } from "@/app/store/useStore";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("user_id");

    let query = supabase.from("orders").select(`
        *,
        order_items (
          id,
          product_id,
          quantity,
          price,
          created_at,
          products (
            id,
            name,
            price,
            image,
            category
          )
        )
      `);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Transform data to match expected format with items containing product info
    const transformedData = data?.map((order) => ({
      ...order,
      items: order.order_items?.map(
        (item: {
          quantity: number;
          price: number;
          products: {
            id: string;
            name: string;
            price: number;
            image: string | null;
            category: string;
          } | null;
        }) => ({
          quantity: item.quantity,
          product: item.products || {
            id: "unknown",
            name: "Unknown Product",
            price: item.price,
            image: null,
            category: "unknown",
          },
        }),
      ),
    }));

    return NextResponse.json(transformedData);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
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

      // Decrease stock for each product
      for (const item of items) {
        const { error: stockError } = await supabase.rpc("decrement_stock", {
          product_id: item.product_id,
          quantity: item.quantity,
        });

        // If RPC doesn't exist, fall back to manual update
        if (stockError) {
          // Get current stock
          const { data: product } = await supabase
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();

          if (product) {
            await supabase
              .from("products")
              .update({ stock: Math.max(0, product.stock - item.quantity) })
              .eq("id", item.product_id);
          }
        }
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
