import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { ProductPlaceholder } from "@/components/product-placeholder";
import { Marquee } from "@/components/marquee";
import { imageUrl } from "@/lib/format";

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

  // 4 modelos para el mosaico del hero.
  const mosaicSlugs = ["guindilla", "arcoiris", "patos", "donuts"];
  const heroMosaic = mosaicSlugs.map((slug) => ({
    slug,
    name:
      productList.find((p) => p.slug === slug)?.name ??
      slug.replace("-", " "),
  }));

  return (
    <>
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col items-start gap-6 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1.5 text-xs font-display font-extrabold uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              9,99 € · porque tus pies se lo merecen
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
              Calcetines{" "}
              <span className="relative inline-block">
                <span className="relative z-10">divertidos</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-primary/30 -z-0 rounded-sm"
                />
              </span>{" "}
              que no se pierden en el cajón.
            </h1>
            <p className="text-lg text-muted-foreground">
              Seis modelos. Cero aburridos. Algodón que aguanta, colores que
              duran y diseños con personalidad para todos los pies — adultos y
              peques.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/productos"
                className={buttonVariants({ size: "lg" })}
              >
                Que empiece la fiesta →
              </Link>
              <Link
                href="/productos?segment=nino"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Para los peques 🦆
              </Link>
            </div>
          </div>

          {/* Mosaico de bloques de color */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {heroMosaic.map((m, i) => (
              <Link
                key={m.slug}
                href={`/productos/${m.slug}`}
                className={`relative aspect-square overflow-hidden rounded-2xl group ${i % 2 === 0 ? "translate-y-3 sm:translate-y-6" : "-translate-y-3 sm:-translate-y-6"} transition-transform hover:scale-[1.02]`}
              >
                <ProductPlaceholder slug={m.slug} name={m.name} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
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
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tighter">
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
      <section className="border-t bg-muted/30">
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
              <h3 className="font-display font-extrabold text-xl mt-2 tracking-tight">
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
