"use client";

import Link from "next/link";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { formatCents } from "@/lib/format";
import { CheckoutButton } from "@/components/checkout-button";

export function CartDrawer() {
  const { items, itemCount, subtotalCents, updateQuantity, removeItem, clear } =
    useCart();

  return (
    <Sheet>
      <SheetTrigger
        className="relative inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-muted"
        aria-label={`Abrir carrito (${itemCount} ${itemCount === 1 ? "artículo" : "artículos"})`}
      >
        <ShoppingBag className="h-4 w-4" />
        <span>Carrito</span>
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tu carrito</SheetTitle>
          <SheetDescription>
            {itemCount === 0
              ? "Tu carrito está vacío."
              : `${itemCount} ${itemCount === 1 ? "artículo" : "artículos"}`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-6 gap-4">
            <ShoppingBag className="h-12 w-12 opacity-40" />
            <p className="text-sm">Aún no has añadido ningún calcetín.</p>
            <Link
              href="/productos"
              className={buttonVariants({ variant: "outline" })}
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-1 -mx-1 py-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex gap-3 border-b pb-4 last:border-b-0"
                >
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover bg-muted"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-md bg-muted" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/productos/${item.slug}`}
                      className="font-medium hover:underline block truncate"
                    >
                      {item.name}
                    </Link>
                    {item.size && (
                      <p className="text-xs text-muted-foreground">
                        Talla {item.size}
                      </p>
                    )}
                    <p className="text-sm font-semibold mt-1">
                      {formatCents(item.priceCents * item.quantity)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity - 1)
                        }
                        className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-muted"
                        aria-label="Reducir cantidad"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.variantId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxStock}
                        className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-muted disabled:opacity-40"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.variantId)}
                        className="ml-auto flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                        aria-label="Eliminar del carrito"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SheetFooter className="border-t pt-4 gap-3">
              <div className="flex w-full items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">
                  {formatCents(subtotalCents)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Envíos e impuestos calculados en checkout.
              </p>
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
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
