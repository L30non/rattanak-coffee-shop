import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Product {
  id: string;
  name: string;
  category: "machines" | "beans" | "accessories" | "ingredients";
  price: number;
  description: string;
  image: string | null;
  stock: number;
  roast_level: string | null;
  origin: string | null;
  weight: string | null;
  features: string[] | null;
  average_rating?: number;
  review_count?: number;
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

export type PaymentMethod = "cash";

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
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
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
      addToCart: (product, quantity) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id,
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }
          return { cart: [...state.cart, { product, quantity }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item,
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
