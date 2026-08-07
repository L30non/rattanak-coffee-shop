import { cache } from "react";
import { createPublicClient } from "@/lib/supabase-public";
import type { Gallery } from "@/app/store/useStore";

export const getGalleries = cache(
  async (options: { category?: string } = {}): Promise<Gallery[]> => {
    const supabase = createPublicClient();
    let query = supabase
      .from("galleries")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (options.category && options.category !== "All") {
      query = query.eq("category", options.category);
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as Gallery[];
  },
);
