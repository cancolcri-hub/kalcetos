import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { Marquee } from "@/components/marquee";
import { imageUrl } from "@/lib/format";

const HERO_BG_PATH = "hero/clothesline.jpg";

export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, name, segment, base_price_cents, compare_at_price_cents, product_images(storage_path, alt_text, is_primary)",
    )
    .eq("status", "active")
    .order("name");

  const productList = products ?? [];
  const heroBg = imageUrl(HERO_BG_PATH);

  return (
    <>
      {/* HERO editorial con foto a fondo completo */}
      <section
        className="relative isolate overflow-hidden"
        style={{
          backgroundImage: heroBg ? `url(${heroBg})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Sobrecapa para legibilidad — sutil */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 text-primary px-4 py-1.5 text-xs font-display font-extrabold uppercase tracking-widest shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Ofertas de verano · 9,99 €
            </span>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
              Calcetines{" "}
              <span className="bg-primary text-primary-foreground px-3 py-0 inline-block rotate-[-2deg] rounded-md">
                divertidos
              </span>{" "}
              para días de sol.
            </h1>
            <p className="text-lg sm:text-xl text-white max-w-xl drop-shadow-md">
              Seis modelos. Cero aburridos. Color que aguanta lavados, algodón
              que respira y diseños con personalidad — para todos los pies.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/productos"
                className={buttonVariants({ size: "lg" }) + " shadow-lg"}
              >
                Que empiece la fiesta →
              </Link>
              <Link
                href="/productos?segment=nino"
                className="inline-flex items-center justify-center rounded-lg bg-white/95 text-foreground hover:bg-white px-4 h-9 text-sm font-medium shadow-lg"
              >
                Para los peques 🦆
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE en rojo guindilla */}
      <Marquee
        items={[
          "Envío 24-48 h",
          "Algodón 80%",
          "Devolución 14 días",
          "Hecho con calma en Sevilla",
          "Made for happy feet",
          "Six models · zero boring",
        ]}
      />

      {/* MODELOS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tighter text-primary">
              La colección
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              {productList.length} diseños listos para tu cajón.
            </p>
          </div>
          <Link
            href="/productos"
            className="text-sm font-display font-bold text-primary hover:underline uppercase tracking-wider"
          >
            Ver todo →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productList.map((p) => {
            const primary =
              p.product_images?.find((i) => i.is_primary) ??
              p.product_images?.[0] ??
              null;
            return (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                segment={p.segment}
                basePriceCents={p.base_price_cents}
                compareAtPriceCents={p.compare_at_price_cents}
                imageUrl={primary ? imageUrl(primary.storage_path) : null}
                imageAlt={primary?.alt_text ?? p.name}
              />
            );
          })}
        </div>
      </section>

      {/* VALORES */}
      <section className="border-t bg-amber-50/40">
        <div className="mx-auto max-w-6xl px-4 py-14 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              title: "Envío 24-48 h",
              body: "Pedido antes de las 14 h, sale el mismo día desde Sevilla. Sin sorpresas en el envío.",
              emoji: "🚚",
            },
            {
              title: "Devolución 14 días",
              body: "Si no son lo tuyo, los recogemos sin preguntas raras. Como manda la ley.",
              emoji: "↩",
            },
            {
              title: "Pago seguro",
              body: "Stripe gestiona tu tarjeta. Nosotros nunca la vemos. Tú compras tranquila.",
              emoji: "🔒",
            },
          ].map((v) => (
            <div key={v.title}>
              <span className="text-3xl" aria-hidden>
                {v.emoji}
              </span>
              <h3 className="font-display font-extrabold text-xl mt-2 tracking-tight text-primary">
                {v.title}
              </h3>
              <p className="text-muted-foreground mt-1">{v.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
