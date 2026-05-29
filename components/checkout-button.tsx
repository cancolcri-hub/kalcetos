"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";

type Props = {
  className?: string;
};

export function CheckoutButton({ className }: Props) {
  const { items } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "No se pudo iniciar el pago");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      toast.error("Error de conexión", { description: String(err) });
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size="lg"
      onClick={handleCheckout}
      disabled={loading || items.length === 0}
      className={className}
    >
      {loading ? "Cargando…" : "Ir a checkout"}
    </Button>
  );
}
