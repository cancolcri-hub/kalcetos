"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  size: string | null;
  color: string | null;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
  maxStock: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, qty: number) => void;
  clear: () => void;
};

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, qty = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.variantId === item.variantId,
          );
          if (existing) {
            const next = Math.min(existing.quantity + qty, item.maxStock);
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId ? { ...i, quantity: next } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(qty, item.maxStock) },
            ],
          };
        }),
      removeItem: (variantId) =>
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        })),
      updateQuantity: (variantId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.variantId !== variantId)
              : state.items.map((i) =>
                  i.variantId === variantId
                    ? { ...i, quantity: Math.min(qty, i.maxStock) }
                    : i,
                ),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "kalcetos-cart-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

/**
 * Hook seguro para SSR/hidratación. Hasta que React monte en cliente, devuelve
 * estado vacío para evitar mismatches entre server y client.
 */
export function useCart() {
  const state = useCartStore();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return {
      items: [] as CartItem[],
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
      clear: state.clear,
      itemCount: 0,
      subtotalCents: 0,
    };
  }
  return {
    items: state.items,
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clear: state.clear,
    itemCount: state.items.reduce((sum, i) => sum + i.quantity, 0),
    subtotalCents: state.items.reduce(
      (sum, i) => sum + i.priceCents * i.quantity,
      0,
    ),
  };
}
