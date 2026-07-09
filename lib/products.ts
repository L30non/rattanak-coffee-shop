import { cache } from "react";
import { createPublicClient } from "@/lib/supabase-public";
import type { Product } from "@/app/store/useStore";

export const getProducts = cache(
  async (options: { category?: string; search?: string } = {}): Promise<
    Product[]
  > => {
    const supabase = createPublicClient();
    let query = supabase.from("products").select("*");

    if (options.category && options.category !== "all") {
      query = query.eq("category", options.category);
    }
    if (options.search) {
      query = query.or(
        `name.ilike.%${options.search}%,category.ilike.%${options.search}%,description.ilike.%${options.search}%`,
      );
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message);
    }
    return (data ?? []) as Product[];
  },
);

export const getProduct = cache(
  async (id: string): Promise<Product | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return null;
    }
    return data as Product;
  },
);
