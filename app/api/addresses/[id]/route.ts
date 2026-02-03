import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the address
    const { data: address, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error in GET /api/addresses/[id]:", error);
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

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Build update object with only provided fields

    //es-lint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (body.label !== undefined) updateData.label = body.label;
    if (body.street_line_1) updateData.street_line_1 = body.street_line_1;
    if (body.street_line_2 !== undefined)
      updateData.street_line_2 = body.street_line_2;
    if (body.city) updateData.city = body.city;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.zip_code) updateData.zip_code = body.zip_code;
    if (body.country) updateData.country = body.country;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.is_default !== undefined) updateData.is_default = body.is_default;

    // Update the address
    const { data: address, error } = await supabase
      .from("addresses")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating address:", error);
      return NextResponse.json(
        { error: "Failed to update address" },
        { status: 500 },
      );
    }

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error("Error in PUT /api/addresses/[id]:", error);
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

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete the address
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting address:", error);
      return NextResponse.json(
        { error: "Failed to delete address" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/addresses/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Handle set default action
    if (body.action === "set-default") {
      // Set this address as default (trigger will handle unsetting others)
      const { data: address, error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error setting default address:", error);
        return NextResponse.json(
          { error: "Failed to set default address" },
          { status: 500 },
        );
      }

      if (!address) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ address });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error in PATCH /api/addresses/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
