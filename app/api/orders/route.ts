/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { Order } from "@/app/store/useStore";
// import { sendOrderConfirmationEmail } from "@/lib/email"; // Commented out until domain is verified

// Generate unique tracking number
function generateTrackingNumber(): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCF-${timestamp}-${random}`;
}

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
        ),
        profiles (
          id,
          email,
          name
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

    // Map the response to match the Order type with items
    const ordersWithItems = data?.map((order: any) => ({
      ...order,
      items:
        order.order_items?.map((item: any) => ({
          product: item.products,
          quantity: item.quantity,
        })) || [],
    }));

    return NextResponse.json(ordersWithItems);
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
    const body = await request.json();

    type OrderItem = { product_id: string; quantity: number; price: number };
    const { items, ...orderData } = body as Omit<Order, "id" | "created_at"> & {
      items?: OrderItem[];
    };

    // Explicitly type items for type safety
    const orderItems: OrderItem[] | undefined = items;

    // Generate tracking number
    const trackingNumber = generateTrackingNumber();

    // Insert order with tracking number
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          ...orderData,
          tracking_number: trackingNumber,
          shipping_carrier: "Standard Delivery",
        },
      ])
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 400 });
    }

    // Insert order items if provided
    if (orderItems && orderItems.length > 0) {
      const itemsToInsert = orderItems.map((item) => ({
        order_id: order.id,
        ...item,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        return NextResponse.json(
          { error: itemsError.message },
          { status: 400 },
        );
      }

      // Update product stock - reduce by ordered quantity
      for (const item of orderItems) {
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();

        if (productError) {
          console.error("Error fetching product stock:", productError);
          continue;
        }

        const newStock = (product.stock || 0) - item.quantity;

        const { error: updateError } = await supabase
          .from("products")
          .update({ stock: Math.max(0, newStock) })
          .eq("id", item.product_id);

        if (updateError) {
          console.error("Error updating product stock:", updateError);
        }
      }
    }

    // TODO: Uncomment when domain is verified at resend.com/domains
    // Send order confirmation email
    /*
    if (process.env.RESEND_API_KEY) {
      try {
        // Fetch user details
        const { data: userData } = await supabase.auth.getUser();
        const userEmail = userData.user?.email;
        const userName = userData.user?.user_metadata?.name || "Customer";

        if (userEmail && orderItems && orderItems.length > 0) {
          // Fetch product names for email
          const productIds = orderItems.map((item) => item.product_id);
          const { data: products } = await supabase
            .from("products")
            .select("id, name")
            .in("id", productIds);

          const productMap = new Map(
            products?.map((p) => [p.id, p.name]) || [],
          );

          await sendOrderConfirmationEmail({
            customerName: userName,
            customerEmail: userEmail,
            orderId: order.id,
            orderDate: order.created_at,
            trackingNumber: trackingNumber,
            items: orderItems.map((item) => ({
              name: productMap.get(item.product_id) || "Product",
              quantity: item.quantity,
              price: item.price,
            })),
            subtotal: order.total_amount || 0,
            tax: order.tax_amount || 0,
            shipping: order.shipping_cost || 0,
            total:
              (order.total_amount || 0) +
              (order.tax_amount || 0) +
              (order.shipping_cost || 0),
            shippingAddress: order.shipping_address || "Not provided",
          });
        }
      } catch (emailError) {
        // Log error but don't fail the order
        console.error("Failed to send confirmation email:", emailError);
      }
    }
    */

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
