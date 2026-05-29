import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { formatCents } from "@/lib/format";
import { ClearCartOnSuccess } from "./clear-cart";

type SearchParams = Promise<{ session_id?: string }>;

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Sesión no encontrada</h1>
        <p className="mt-2 text-muted-foreground">
          Si has completado un pago y has llegado aquí por error, revisa tu
          email — recibirás la confirmación en cuanto procesemos el pedido.
        </p>
      </section>
    );
  }

  const supabase = createServiceClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, total_cents, currency, customer_id, customers(email, name), order_items(quantity, unit_price_cents, line_total_cents, product_variants(sku, size, products(name, slug)))",
    )
    .eq("stripe_session_id", session_id)
    .maybeSingle();

  // El webhook puede tardar 1-2 s. Mostramos el mensaje de éxito aunque
  // la fila aún no esté en la BD; el email transaccional confirmará.
  if (!order) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <ClearCartOnSuccess />
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          ¡Gracias por tu compra!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Estamos procesando tu pedido. Recibirás un email de confirmación en
          breve con todos los detalles.
        </p>
        <Link
          href="/"
          className={buttonVariants({ size: "lg" }) + " mt-8 inline-flex"}
        >
          Volver a la tienda
        </Link>
      </section>
    );
  }

  const customer = order.customers as unknown as {
    email: string;
    name: string | null;
  } | null;

  const items = (order.order_items ?? []) as unknown as Array<{
    quantity: number;
    line_total_cents: number;
    product_variants: {
      sku: string;
      size: string | null;
      products: { name: string; slug: string };
    };
  }>;

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <ClearCartOnSuccess />
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-6 text-3xl font-bold tracking-tight">
          ¡Gracias por tu compra!
        </h1>
        <p className="mt-3 text-muted-foreground">
          Hemos recibido tu pedido. Enviamos confirmación a{" "}
          <strong>{customer?.email}</strong>.
        </p>
      </div>

      <div className="mt-10 rounded-xl border p-6 space-y-4">
        <div className="flex justify-between items-baseline border-b pb-3">
          <h2 className="font-semibold">Resumen del pedido</h2>
          <span className="text-xs text-muted-foreground">
            #{order.id.slice(0, 8)}
          </span>
        </div>
        <ul className="space-y-3">
          {items.map((it, i) => (
            <li
              key={i}
              className="flex justify-between text-sm"
            >
              <span>
                <Link
                  href={`/productos/${it.product_variants.products.slug}`}
                  className="hover:underline font-medium"
                >
                  {it.product_variants.products.name}
                </Link>
                {it.product_variants.size && (
                  <span className="text-muted-foreground">
                    {" "}
                    · Talla {it.product_variants.size}
                  </span>
                )}
                <span className="text-muted-foreground"> × {it.quantity}</span>
              </span>
              <span className="font-medium">
                {formatCents(it.line_total_cents)}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCents(order.total_cents)}</span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/productos"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          Seguir comprando
        </Link>
      </div>
    </section>
  );
}
