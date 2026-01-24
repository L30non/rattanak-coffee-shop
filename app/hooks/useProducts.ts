import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, Order } from "@/app/store/useStore";

export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== "all") params.append("category", category);

      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json() as Promise<Product[]>;
    },
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return response.json() as Promise<Product>;
    },
    enabled: !!id,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Omit<Product, "id">) => {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) throw new Error("Failed to add product");
      return response.json() as Promise<Product>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Product> & { id: string }) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update product");
      return response.json() as Promise<Product>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useOrders = (userId?: string) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userId) params.append("user_id", userId);

      const response = await fetch(`/api/orders?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json() as Promise<Order[]>;
    },
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) throw new Error("Failed to fetch order");
      return response.json() as Promise<Order>;
    },
    enabled: !!id,
  });
};

export interface CreateOrderInput {
  user_id: string;
  status: Order["status"];
  total: number;
  shipping_address: string;
  payment_method: Order["payment_method"];
  date: string;
  updated_at: string;
  items?: Array<{ product_id: string; quantity: number; price: number }>;
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newOrder: CreateOrderInput) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json() as Promise<Order>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Order> & { id: string }) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update order");
      return response.json() as Promise<Order>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
