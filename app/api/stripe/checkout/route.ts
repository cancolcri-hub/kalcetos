import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.uuid(),
        quantity: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(20),
});

export async function POST(req: Request) {
  let payload: z.infer<typeof requestSchema>;
  try {
    payload = requestSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json(
      { error: "Body inválido", details: String(err) },
      { status: 400 },
    );
  }

  const supabase = createServiceClient();
  const variantIds = payload.items.map((i) => i.variantId);

  // Leemos precios desde Supabase. NUNCA confiar en lo que mande el cliente.
  const { data: variants, error } = await supabase
    .from("product_variants")
    .select(
      "id, sku, size, stock, price_cents, products(id, name, slug, base_price_cents, segment)",
    )
    .in("id", variantIds);

  if (error || !variants || variants.length === 0) {
    return NextResponse.json(
      { error: "No se pudieron leer las variantes" },
      { status: 500 },
    );
  }

  const byId = new Map(variants.map((v) => [v.id, v]));

  // Validar stock y construir line_items.
  const lineItems: Array<{
    price_data: {
      currency: string;
      product_data: { name: string; metadata: Record<string, string> };
      unit_amount: number;
    };
    quantity: number;
  }> = [];

  for (const item of payload.items) {
    const variant = byId.get(item.variantId);
    if (!variant) {
      return NextResponse.json(
        { error: `Variante no encontrada: ${item.variantId}` },
        { status: 400 },
      );
    }
    if (variant.stock < item.quantity) {
      return NextResponse.json(
        {
          error: `Stock insuficiente para ${(variant.products as unknown as { name: string }).name} (talla ${variant.size}). Disponibles: ${variant.stock}`,
        },
        { status: 400 },
      );
    }
    const product = variant.products as unknown as {
      id: string;
      name: string;
      slug: string;
      base_price_cents: number;
    };
    const unitAmount = variant.price_cents ?? product.base_price_cents;

    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: `${product.name}${variant.size ? ` — Talla ${variant.size}` : ""}`,
          metadata: {
            variant_id: variant.id,
            product_id: product.id,
            product_slug: product.slug,
            sku: variant.sku,
          },
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    });
  }

  // En dev queremos volver a localhost; en prod, al dominio real.
  // Tomamos el origin de la request — refleja la URL desde la que el usuario
  // inició el checkout, sea localhost:3000 o https://kalcetos.shop.
  const siteUrl =
    req.headers.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      customer_creation: "always",
      // Recogemos email + dirección de envío en la propia hoja de Stripe.
      shipping_address_collection: {
        allowed_countries: ["ES", "PT", "FR", "AD"],
      },
      phone_number_collection: { enabled: false },
      locale: "es",
      // Metadata global para reconstruir el pedido en el webhook.
      metadata: {
        cart_items: JSON.stringify(
          payload.items.map((i) => ({
            variant_id: i.variantId,
            quantity: i.quantity,
          })),
        ),
      },
    });

    if (!session.url) {
      throw new Error("Stripe no devolvió URL de sesión");
    }
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      {
        error: "No se pudo crear la sesión de pago",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
