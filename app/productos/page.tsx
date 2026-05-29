import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/product-card";
import { imageUrl, segmentLabel } from "@/lib/format";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Catálogo completo de calcetines Kalcetos: adulto y niño.",
};

type SearchParams = Promise<{ segment?: string }>;

const SEGMENTS = ["adulto", "nino"] as const;

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { segment } = await searchParams;
  const activeSegment =
    segment && (SEGMENTS as readonly string[]).includes(segment)
      ? segment
      : null;

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      "id, slug, name, segment, base_price_cents, compare_at_price_cents, product_images(storage_path, alt_text, is_primary)",
    )
    .eq("status", "active")
    .order("name");

  if (activeSegment) {
    query = query.eq("segment", activeSegment);
  }

  const { data: products, error } = await query;

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-destructive">
          Error al cargar el catálogo: {error.message}
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {activeSegment
            ? `Calcetines para ${segmentLabel(activeSegment).toLowerCase()}`
            : "Todo el catálogo"}
        </h1>
        <p className="text-muted-foreground">
          {products.length} {products.length === 1 ? "modelo" : "modelos"}
        </p>
      </div>

      <nav className="flex flex-wrap gap-2 mb-8 text-sm">
        <FilterLink href="/productos" active={activeSegment === null}>
          Todos
        </FilterLink>
        {SEGMENTS.map((s) => (
          <FilterLink
            key={s}
            href={`/productos?segment=${s}`}
            active={activeSegment === s}
          >
            {segmentLabel(s)}
          </FilterLink>
        ))}
      </nav>

      {products.length === 0 ? (
        <p className="text-muted-foreground">
          No hay productos en este segmento todavía.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
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
      )}
    </section>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 transition-colors ${
        active
          ? "bg-foreground text-background border-foreground"
          : "hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
}
