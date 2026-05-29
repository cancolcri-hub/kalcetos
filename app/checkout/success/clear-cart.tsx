"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/**
 * Limpia el carrito una vez que el usuario llega a /checkout/success.
 * No bloquea el render — solo dispara `clear` después de la hidratación.
 */
export function ClearCartOnSuccess() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
