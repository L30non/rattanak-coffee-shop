import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CategoryValue, SubcategoryValue } from "@/lib/categories";
import { formatVariant } from "@/lib/beans";
import type { CartVariant, GrindType, WeightOption } from "@/lib/beans";

export interface Product {
  id: string;
  name: string;
  category: CategoryValue;
  subcategory: SubcategoryValue | null;
  price: number;
  description: string;
  image: string | null;
  stock: number;
  roast_level: string | null;
  origin: string | null;
  weight: string | null;
  /** Beans only: admin-defined weights, each with its own price. */
  weight_options: WeightOption[] | null;
  /** Beans only: which grind types the customer may pick. */
  grind_options: GrindType[] | null;
  features: string[] | null;
  average_rating?: number;
  review_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Gallery {
  id: string;
  src: string;
  alt: string;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
  /** Beans only: the grind/weight the customer selected. */
  variant?: CartVariant;
  /** Price for the selected variant; falls back to the product price. */
  unitPrice?: number;
  /**
   * Pre-formatted variant text on order lines loaded from the database, where
   * only the snapshot label survives. Display only — never re-priced.
   */
  variantLabel?: string;
}

/**
 * Cart identity. The same product in two different weights (or grinds) is two
 * separate lines, so the key folds the variant in. Derived rather than stored
 * so carts persisted before variants existed still resolve correctly.
 */
export function cartItemKey(item: {
  product: Pick<Product, "id">;
  variant?: CartVariant;
}): string {
  return [
    item.product.id,
    item.variant?.grind ?? "",
    item.variant?.weightLabel ?? "",
  ].join("|");
}

export function cartItemUnitPrice(item: CartItem): number {
  return item.unitPrice ?? item.product.price;
}

/** Variant text for display, from a live selection or an order snapshot. */
export function cartItemVariantLabel(item: CartItem): string {
  return item.variantLabel ?? formatVariant(item.variant);
}

export interface User {
  id: string;
  email: string;
  name: string;
  is_admin: boolean;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string | null;
  street_line_1: string;
  street_line_2: string | null;
  city: string;
  state: string | null;
  zip_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type PaymentMethod = "cash" | "bakong";

export interface Order {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping_address: string;
  address_id?: string | null;
  payment_method: PaymentMethod;
  date: string;
  created_at: string;
  updated_at: string;
  tracking_number?: string;
  shipping_carrier?: string;
  tax_amount?: number;
  shipping_cost?: number;
  items?: CartItem[];
  profiles?: {
    id: string;
    email: string;
    name: string;
  };
}

interface StoreState {
  cart: CartItem[];
  user: User | null;
  orders: Order[]; // Local cache of orders for demo/UI
  addresses: Address[]; // Local cache of addresses
  addToCart: (
    product: Product,
    quantity: number,
    variant?: CartVariant,
    unitPrice?: number,
  ) => void;
  removeFromCart: (itemKey: string) => void;
  updateCartQuantity: (itemKey: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  setAddresses: (addresses: Address[]) => void;
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, address: Partial<Address>) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      user: null,
      orders: [],
      addresses: [],
      addToCart: (product, quantity, variant, unitPrice) =>
        set((state) => {
          const newItem: CartItem = {
            product,
            quantity,
            variant,
            unitPrice: unitPrice ?? product.price,
          };
          const key = cartItemKey(newItem);
          const existingItem = state.cart.find(
            (item) => cartItemKey(item) === key,
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                cartItemKey(item) === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, newItem] };
        }),
      removeFromCart: (itemKey) =>
        set((state) => ({
          cart: state.cart.filter((item) => cartItemKey(item) !== itemKey),
        })),
      updateCartQuantity: (itemKey, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            cartItemKey(item) === itemKey ? { ...item, quantity } : item,
          ),
        })),
      clearCart: () => set({ cart: [] }),
      setUser: (user) => set({ user }),
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updated_at: new Date().toISOString() }
              : order,
          ),
        })),
      setAddresses: (addresses) => set({ addresses }),
      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, address],
        })),
      updateAddress: (addressId, updatedAddress) =>
        set((state) => ({
          addresses: state.addresses.map((address) =>
            address.id === addressId
              ? {
                  ...address,
                  ...updatedAddress,
                  updated_at: new Date().toISOString(),
                }
              : address,
          ),
        })),
      deleteAddress: (addressId) =>
        set((state) => ({
          addresses: state.addresses.filter(
            (address) => address.id !== addressId,
          ),
        })),
      setDefaultAddress: (addressId) =>
        set((state) => ({
          addresses: state.addresses.map((address) => ({
            ...address,
            is_default: address.id === addressId,
          })),
        })),
    }),
    {
      name: "coffee-shop-storage",
    },
  ),
);
