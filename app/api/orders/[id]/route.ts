import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Order } from "@/app/store/useStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
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
            category,
            price,
            description,
            image,
            stock,
            roast_level,
            origin,
            weight,
            features,
            created_at,
            updated_at
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Map the response to match the Order type with items
    const orderWithItems = {
      ...data,

      items:
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.order_items?.map((item: any) => ({
          product: item.products,
          quantity: item.quantity,
        })) || [],
    };

    return NextResponse.json(orderWithItems);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;
    const body: Partial<Order> = await request.json();

    const { data, error } = await supabase
      .from("orders")
      .update(body)
      .eq("id", id)
      .select()
      .single();

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // First, check if the order exists and get its status
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("status, user_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user owns this order
    if (order.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this order" },
        { status: 403 },
      );
    }

    // Only allow deletion of delivered or cancelled orders
    if (order.status !== "delivered" && order.status !== "cancelled") {
      return NextResponse.json(
        { error: "Only delivered or cancelled orders can be deleted" },
        { status: 400 },
      );
    }

    // Delete order items first (due to foreign key constraint)
    await supabase.from("order_items").delete().eq("order_id", id);

    // Then delete the order
    const { error: deleteError } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
