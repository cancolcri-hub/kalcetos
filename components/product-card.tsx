import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ProductPlaceholder } from "@/components/product-placeholder";
import { formatCents, modelTheme, segmentLabel } from "@/lib/format";

type Props = {
  slug: string;
  name: string;
  segment: string;
  basePriceCents: number;
  compareAtPriceCents: number | null;
  imageUrl: string | null;
  imageAlt: string;
};

export function ProductCard({
  slug,
  name,
  segment,
  basePriceCents,
  compareAtPriceCents,
  imageUrl,
  imageAlt,
}: Props) {
  const hasDiscount =
    compareAtPriceCents != null && compareAtPriceCents > basePriceCents;
  const discountPct = hasDiscount
    ? Math.round(
        ((compareAtPriceCents! - basePriceCents) / compareAtPriceCents!) * 100,
      )
    : 0;
  const theme = modelTheme(slug);

  return (
    <Link href={`/productos/${slug}`} className="group block">
      <Card className="overflow-hidden border-0 shadow-none bg-transparent p-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
              <ProductPlaceholder slug={slug} name={name} />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-full bg-background/95 px-2.5 py-0.5 text-xs font-semibold">
            {segmentLabel(segment)}
          </span>
          {hasDiscount && (
            <span
              className="absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-black text-background"
              style={{ backgroundColor: theme.accent }}
            >
              −{discountPct}%
            </span>
          )}
        </div>
        <div className="p-1 pt-4 space-y-1">
          <h3
            className="font-display font-extrabold tracking-tight text-xl transition-colors"
            style={{ color: "inherit" }}
          >
            <span
              className="bg-[length:0_2px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_2px] transition-[background-size] duration-300"
              style={{
                backgroundImage: `linear-gradient(${theme.accent}, ${theme.accent})`,
              }}
            >
              {name}
            </span>
          </h3>
          <div className="flex items-baseline gap-2">
            <span
              className="text-xl font-black"
              style={{ color: theme.accent }}
            >
              {formatCents(basePriceCents)}
            </span>
            {hasDiscount ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatCents(compareAtPriceCents!)}
              </span>
            ) : null}
          </div>
        </div>
      </Card>
    </Link>
  );
}
