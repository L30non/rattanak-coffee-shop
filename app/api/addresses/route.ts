import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all addresses for the user, ordered by default first, then by creation date
    const { data: addresses, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching addresses:", error);
      return NextResponse.json(
        { error: "Failed to fetch addresses" },
        { status: 500 },
      );
    }

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error in GET /api/addresses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.street_line_1 || !body.city || !body.zip_code) {
      return NextResponse.json(
        { error: "Missing required fields: street_line_1, city, zip_code" },
        { status: 400 },
      );
    }

    // Create the address
    const addressData = {
      user_id: user.id,
      label: body.label || null,
      street_line_1: body.street_line_1,
      street_line_2: body.street_line_2 || null,
      city: body.city,
      state: body.state || null,
      zip_code: body.zip_code,
      country: body.country || "USA",
      phone: body.phone || null,
      is_default: body.is_default || false,
    };

    const { data: address, error } = await supabase
      .from("addresses")
      .insert(addressData)
      .select()
      .single();

    if (error) {
      console.error("Error creating address:", error);
      return NextResponse.json(
        { error: "Failed to create address" },
        { status: 500 },
      );
    }

    return NextResponse.json({ address }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/addresses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
