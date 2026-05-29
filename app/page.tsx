import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
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

  // 4 fotos para el mosaico del hero (uno por modelo).
  const mosaicSlugs = ["guindilla", "arcoiris", "patos", "donuts"];
  const mosaicImages = mosaicSlugs.map((slug) => ({
    slug,
    src: `/products/${slug}/01-frontal.webp`,
  }));

  return (
    <>
      {/* HERO */}
      <section className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start gap-6 max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Oferta lanzamiento · 9,99&nbsp;€
            </span>
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl leading-[1.05]">
              Calcetines{" "}
              <span className="text-primary">con carácter</span>{" "}
              para los pies que importan.
            </h1>
            <p className="text-lg text-muted-foreground">
              Seis modelos, dos segmentos y un patrón claro: algodón de calidad,
              colores que aguantan lavados y diseños que no pasan desapercibidos.
              Envío rápido a toda España.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/productos" className={buttonVariants({ size: "lg" })}>
                Ver catálogo
              </Link>
              <Link
                href="/productos?segment=nino"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Para los peques
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <span>✓ Algodón 80%</span>
              <span>✓ Envío en 24-48 h</span>
              <span>✓ Devolución 14 días</span>
            </div>
          </div>

          {/* Mosaico de fotos */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {mosaicImages.map((m, i) => (
              <Link
                key={m.slug}
                href={`/productos/${m.slug}`}
                className={`relative aspect-square overflow-hidden rounded-2xl bg-muted group ${i % 2 === 0 ? "translate-y-4" : "-translate-y-4"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.src}
                  alt={`Calcetines Kalcetos modelo ${m.slug}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold capitalize">
                  {m.slug.replace("-", " ")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MODELOS */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Nuestros modelos</h2>
            <p className="text-muted-foreground mt-1">
              {productList.length} diseños listos para tu cajón.
            </p>
          </div>
          <Link
            href="/productos"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todo el catálogo →
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
        <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-semibold mb-1">Envío en 24-48 h</h3>
            <p className="text-muted-foreground">
              Pedido antes de las 14 h, sale el mismo día desde Sevilla.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Devolución 14 días</h3>
            <p className="text-muted-foreground">
              Si no son lo tuyo, los recogemos sin preguntas raras.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Pago seguro</h3>
            <p className="text-muted-foreground">
              Stripe gestiona tu tarjeta. Nosotros nunca la vemos.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
