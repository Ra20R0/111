"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/shop";

export type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const total = lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0);
    const count = lines.reduce((sum, l) => sum + l.quantity, 0);
    return {
      lines,
      total,
      count,
      add: (product, quantity = 1) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.product.id === product.id);
          if (existing) {
            return prev.map((l) =>
              l.product.id === product.id ? { ...l, quantity: l.quantity + quantity } : l,
            );
          }
          return [...prev, { product, quantity }];
        }),
      setQuantity: (productId, quantity) =>
        setLines((prev) =>
          quantity <= 0
            ? prev.filter((l) => l.product.id !== productId)
            : prev.map((l) => (l.product.id === productId ? { ...l, quantity } : l)),
        ),
      remove: (productId) => setLines((prev) => prev.filter((l) => l.product.id !== productId)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
