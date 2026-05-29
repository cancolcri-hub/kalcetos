import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCents, imageUrl, segmentLabel } from "@/lib/format";
import { AddToCartForm } from "@/components/add-to-cart-form";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name, meta_title, meta_description, description_short")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!data) return { title: "Producto no encontrado" };

  return {
    title: data.meta_title ?? data.name,
    description: data.meta_description ?? data.description_short ?? undefined,
    openGraph: {
      title: data.meta_title ?? data.name,
      description: data.meta_description ?? data.description_short ?? undefined,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      "id, slug, name, segment, brand, description_short, description_long, base_price_cents, compare_at_price_cents, product_variants(id, sku, size, color, stock, price_cents), product_images(storage_path, alt_text, position, is_primary)",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !product) {
    notFound();
  }

  const images = (product.product_images ?? []).sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.position ?? 0) - (b.position ?? 0);
  });
  const variants = product.product_variants ?? [];
  const hasDiscount =
    product.compare_at_price_cents != null &&
    product.compare_at_price_cents > product.base_price_cents;
  const totalStock = variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);

  return (
    <article className="mx-auto max-w-6xl px-4 py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <a href="/productos" className="hover:underline">
          ← Volver al catálogo
        </a>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
            {images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl(images[0].storage_path)}
                alt={images[0].alt_text}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                Imagen próximamente
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1).map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={imageUrl(img.storage_path)}
                  alt={img.alt_text}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {segmentLabel(product.segment)}
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold">
                {formatCents(product.base_price_cents)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCents(product.compare_at_price_cents!)}
                </span>
              )}
            </div>
          </div>

          {product.description_short && (
            <p className="text-muted-foreground">{product.description_short}</p>
          )}

          <AddToCartForm
            productId={product.id}
            slug={product.slug}
            name={product.name}
            basePriceCents={product.base_price_cents}
            imageUrl={images[0] ? imageUrl(images[0].storage_path) : null}
            variants={variants}
          />

          {product.description_long && (
            <div className="pt-6 border-t prose prose-sm max-w-none text-muted-foreground">
              <p>{product.description_long}</p>
            </div>
          )}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description_short ?? undefined,
            brand: product.brand
              ? { "@type": "Brand", name: product.brand }
              : undefined,
            offers: {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: (product.base_price_cents / 100).toFixed(2),
              availability:
                totalStock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
    </article>
  );
}
