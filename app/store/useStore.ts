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
  created_at: string;
  updated_at: string;
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

export type PaymentMethod = "cash";

export interface Order {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  shipping_address: string;
  payment_method: PaymentMethod;
  date: string; // Order date (when the order was placed)
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

interface StoreState {
  cart: CartItem[];
  user: User | null;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
<<<<<<< HEAD
=======
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
>>>>>>> parent of 3a72575 (Added Stripe Payment as another payment method. Improved fix of order not rendering properly on the web.)
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      user: null,
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
<<<<<<< HEAD
=======
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status } : order,
          ),
        })),
      login: (email) =>
        set({
          user: {
            id: "1",
            email,
            name: email.split("@")[0],
            is_admin: email.includes("admin"),
            created_at: new Date().toISOString(),
          },
        }),
      register: (name, email) =>
        set({
          user: {
            id: "1",
            email,
            name,
            is_admin: email.includes("admin"),
            created_at: new Date().toISOString(),
          },
        }),
      logout: () => set({ user: null }),
>>>>>>> parent of 3a72575 (Added Stripe Payment as another payment method. Improved fix of order not rendering properly on the web.)
    }),
    {
      name: "coffee-shop-storage",
    },
  ),
);
