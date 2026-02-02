import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductStore {
  // Client-side only state (filters, ephemeral UI state)
  filter: string;
  setFilter: (filter: string) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      filter: "all",
      setFilter: (filter) => set({ filter }),
    }),
    {
      name: "product-storage",
    },
  ),
);
