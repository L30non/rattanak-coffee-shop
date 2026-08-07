import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Gallery } from "@/app/store/useStore";

export const useGalleries = (category?: string) => {
  return useQuery({
    queryKey: ["galleries", category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);

      const response = await fetch(`/api/galleries?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch galleries");
      return response.json() as Promise<Gallery[]>;
    },
  });
};

export const useAddGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      newGallery: Omit<Gallery, "id" | "created_at" | "updated_at">,
    ) => {
      const response = await fetch("/api/galleries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGallery),
      });
      if (!response.ok) throw new Error("Failed to add gallery image");
      return response.json() as Promise<Gallery>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Gallery> & { id: string }) => {
      const response = await fetch(`/api/galleries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update gallery image");
      return response.json() as Promise<Gallery>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/galleries/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete gallery image");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleries"] });
    },
  });
};
