"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { formatCents } from "@/lib/format";
import { CheckoutButton } from "@/components/checkout-button";

export default function CarritoPage() {
  const { items, itemCount, subtotalCents, updateQuantity, removeItem, clear } =
    useCart();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-40" />
        <h1 className="mt-6 text-2xl font-bold tracking-tight">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-muted-foreground">
          Aún no has añadido ningún calcetín. Date una vuelta por el catálogo.
        </p>
        <Link
          href="/productos"
          className={buttonVariants({ size: "lg" }) + " mt-6 inline-flex"}
        >
          Ver catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <header className="flex items-baseline justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tu carrito</h1>
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ul className="lg:col-span-2 divide-y border-y">
          {items.map((item) => (
            <li key={item.variantId} className="flex gap-4 py-6">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-28 w-28 rounded-md object-cover bg-muted"
                />
              ) : (
                <div className="h-28 w-28 rounded-md bg-muted" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/productos/${item.slug}`}
                      className="font-semibold hover:underline"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="text-sm text-muted-foreground">
                        Talla {item.size}
                        {item.color ? ` · ${item.color}` : ""}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {formatCents(item.priceCents)} / unidad
                    </p>
                  </div>
                  <p className="font-bold">
                    {formatCents(item.priceCents * item.quantity)}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity - 1)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-sm font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.variantId, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.maxStock}
                    className="flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted disabled:opacity-40"
                    aria-label="Aumentar cantidad"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="space-y-4 h-fit p-6 rounded-xl border bg-muted/30">
          <h2 className="font-semibold">Resumen</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCents(subtotalCents)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Envío</span>
            <span className="text-muted-foreground">Calculado en checkout</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">Total estimado</span>
            <span className="text-xl font-bold">
              {formatCents(subtotalCents)}
            </span>
          </div>
          <CheckoutButton className="w-full" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clear}
            className="w-full"
          >
            Vaciar carrito
          </Button>
        </aside>
      </div>
    </section>
  );
}
