"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/lib/cart-store";

type Variant = {
  id: string;
  size: string | null;
  color: string | null;
  stock: number;
  price_cents: number | null;
};

type Props = {
  productId: string;
  slug: string;
  name: string;
  basePriceCents: number;
  imageUrl: string | null;
  variants: Variant[];
};

export function AddToCartForm({
  productId,
  slug,
  name,
  basePriceCents,
  imageUrl,
  variants,
}: Props) {
  const { addItem } = useCart();
  const [selectedId, setSelectedId] = useState<string>(
    variants[0]?.id ?? "",
  );

  if (variants.length === 0) {
    return (
      <Button disabled size="lg" type="button">
        Sin stock
      </Button>
    );
  }

  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];
  const outOfStock = selected.stock <= 0;

  const handleAdd = () => {
    const item: Omit<CartItem, "quantity"> = {
      variantId: selected.id,
      productId,
      slug,
      name,
      size: selected.size,
      color: selected.color,
      priceCents: selected.price_cents ?? basePriceCents,
      imageUrl,
      maxStock: selected.stock,
    };
    addItem(item, 1);
    toast.success(`${name} añadido al carrito`, {
      description: selected.size ? `Talla ${selected.size}` : undefined,
    });
  };

  return (
    <div className="space-y-3">
      {variants.length > 1 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Talla</h2>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const active = v.id === selected.id;
              const disabled = v.stock <= 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedId(v.id)}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "hover:bg-muted"
                  } ${disabled ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {variants.length === 1 && variants[0].size && (
        <p className="text-sm text-muted-foreground">
          Talla disponible: <span className="font-medium">{variants[0].size}</span>
        </p>
      )}

      <Button
        size="lg"
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
      >
        {outOfStock ? "Sin stock" : "Añadir al carrito"}
      </Button>

      <p className="text-xs text-muted-foreground">
        {selected.stock} {selected.stock === 1 ? "unidad" : "unidades"} en stock
      </p>
    </div>
  );
}
