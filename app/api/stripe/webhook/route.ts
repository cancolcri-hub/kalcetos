import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { sendCapiEvent } from "@/lib/meta-capi";

// Stripe webhooks llegan como raw body — Next.js no debe parsearlos.
export const runtime = "nodejs";

type CartItemMeta = { variant_id: string; quantity: number };

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    console.error(
      "Webhook recibido sin firma o sin STRIPE_WEBHOOK_SECRET configurado",
    );
    return NextResponse.json({ error: "Webhook no configurado" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Firma de webhook inválida:", err);
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Otros eventos los aceptamos pero no actuamos sobre ellos.
    return NextResponse.json({ received: true, type: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const supabase = createServiceClient();

  // 1) Idempotencia: si ya tenemos esta sesión registrada, salir.
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // 2) Upsert cliente por email.
  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) {
    console.error("Sesión sin email de cliente:", session.id);
    return NextResponse.json(
      { error: "Sesión sin email" },
      { status: 400 },
    );
  }

  const shipping = session.collected_information?.shipping_details;
  const customerData = {
    email,
    name: session.customer_details?.name ?? shipping?.name ?? null,
    phone: session.customer_details?.phone ?? null,
    address_line1: shipping?.address?.line1 ?? null,
    address_line2: shipping?.address?.line2 ?? null,
    city: shipping?.address?.city ?? null,
    postal_code: shipping?.address?.postal_code ?? null,
    country: shipping?.address?.country ?? "ES",
  };

  const { data: customer, error: customerErr } = await supabase
    .from("customers")
    .upsert(customerData, { onConflict: "email" })
    .select("id")
    .single();

  if (customerErr || !customer) {
    console.error("Error al upsert customer:", customerErr);
    return NextResponse.json(
      { error: "Error al guardar cliente" },
      { status: 500 },
    );
  }

  // 3) Crear order.
  const totalCents = session.amount_total ?? 0;
  const subtotalCents = session.amount_subtotal ?? totalCents;
  const taxCents = session.total_details?.amount_tax ?? 0;
  const shippingCents = session.total_details?.amount_shipping ?? 0;

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      customer_id: customer.id,
      stripe_session_id: session.id,
      status: "paid",
      subtotal_cents: subtotalCents,
      shipping_cents: shippingCents,
      tax_cents: taxCents,
      total_cents: totalCents,
      currency: (session.currency ?? "eur").toUpperCase(),
    })
    .select("id")
    .single();

  if (orderErr || !order) {
    console.error("Error al crear order:", orderErr);
    return NextResponse.json(
      { error: "Error al crear pedido" },
      { status: 500 },
    );
  }

  // 4) Crear order_items desde la metadata cart_items.
  let cartItems: CartItemMeta[] = [];
  try {
    cartItems = JSON.parse(
      session.metadata?.cart_items ?? "[]",
    ) as CartItemMeta[];
  } catch {
    console.error("cart_items metadata inválida en session", session.id);
  }

  if (cartItems.length > 0) {
    // Necesitamos precios actuales de las variantes (cents) para congelarlos.
    const variantIds = cartItems.map((i) => i.variant_id);
    const { data: variants } = await supabase
      .from("product_variants")
      .select("id, price_cents, products(base_price_cents)")
      .in("id", variantIds);

    const byId = new Map(
      (variants ?? []).map((v) => [
        v.id,
        v.price_cents ??
          (v.products as unknown as { base_price_cents: number })
            .base_price_cents,
      ]),
    );

    const rows = cartItems.map((i) => {
      const unit = byId.get(i.variant_id) ?? 0;
      return {
        order_id: order.id,
        variant_id: i.variant_id,
        quantity: i.quantity,
        unit_price_cents: unit,
        line_total_cents: unit * i.quantity,
      };
    });

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(rows);
    if (itemsErr) {
      console.error("Error al crear order_items:", itemsErr);
      // No devolvemos 500 — el pedido ya está creado, los items se pueden
      // reconstruir desde Stripe si hace falta.
    }
  }

  // Meta CAPI: evento Purchase server-side. No-op si no hay credenciales.
  // event_id = stripe_session_id → deduplicación con el Purchase del Pixel cliente
  // (cuando lo añadamos en /checkout/success).
  await sendCapiEvent("Purchase", {
    eventId: session.id,
    userData: { email },
    customData: {
      currency: (session.currency ?? "eur").toUpperCase(),
      value: totalCents / 100,
      content_ids: cartItems.map((i) => i.variant_id),
      content_type: "product",
      num_items: cartItems.reduce((sum, i) => sum + i.quantity, 0),
    },
    sourceUrl: session.success_url ?? undefined,
  });

  // TODO F1.5.f: enviar email de confirmación con Resend cuando esté listo.

  return NextResponse.json({ received: true, order_id: order.id });
}
