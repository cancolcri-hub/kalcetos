/**
 * scripts/import-products.ts
 *
 * Importa el catálogo desde scripts/producto.csv al schema `kalcetos`.
 * Soporta multi-variante: filas con el mismo `modelo` se agrupan en un solo
 * producto con varias variantes (una por talla / color / SKU).
 *
 * Además inserta las imágenes que estén en public/products/{slug}/.
 *
 * Idempotente: borra TODOS los productos previos y reinserta. Pensado para
 * catálogo pequeño en fase de prueba.
 *
 * Uso: npx tsx scripts/import-products.ts
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types";

loadEnv({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRole) {
  console.error(
    "✗ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local",
  );
  process.exit(1);
}

const supabase = createClient<Database, "kalcetos">(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: "kalcetos" },
});

type Row = {
  sku: string;
  modelo: string;
  segmento: string;
  variante_talla: string;
  color: string;
  precio_coste: string;
  pvp: string;
  compare_at_price: string;
  stock: string;
  descripcion_corta: string;
  material: string;
  caña: string;
  keywords_seo: string;
};

function parseCsv(text: string): Row[] {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row as Row;
  });
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function eurosToCents(eur: string): number {
  return Math.round(Number.parseFloat(eur.replace(",", ".")) * 100);
}

async function wipeCatalog() {
  console.log("Borrando catálogo previo...");
  await supabase.from("product_images").delete().not("id", "is", null);
  await supabase.from("product_variants").delete().not("id", "is", null);
  await supabase.from("products").delete().not("id", "is", null);
}

async function insertProduct(modelo: string, segmento: string, baseRow: Row) {
  const slug = slugify(modelo);
  const basePriceCents = eurosToCents(baseRow.pvp);
  const compareAtCents = baseRow.compare_at_price
    ? eurosToCents(baseRow.compare_at_price)
    : null;

  const longDesc = [
    baseRow.descripcion_corta + ".",
    `Composición: ${baseRow.material}.`,
    `Caña ${baseRow.caña}.`,
  ].join(" ");

  const { data, error } = await supabase
    .from("products")
    .insert({
      slug,
      name: modelo,
      segment: segmento,
      brand: "Kalcetos",
      description_short: baseRow.descripcion_corta,
      description_long: longDesc,
      meta_title: `${modelo} — Calcetines ${segmento} | Kalcetos`,
      meta_description: baseRow.descripcion_corta,
      base_price_cents: basePriceCents,
      compare_at_price_cents: compareAtCents,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error(`✗ Producto ${modelo}: ${error?.message}`);
    return null;
  }
  return { id: data.id, slug };
}

async function insertVariant(productId: string, row: Row) {
  const { error } = await supabase.from("product_variants").insert({
    product_id: productId,
    sku: row.sku,
    size: row.variante_talla,
    color: row.color,
    stock: Number.parseInt(row.stock, 10),
  });
  if (error) {
    console.error(`  ✗ Variante ${row.sku}: ${error.message}`);
    return false;
  }
  return true;
}

async function insertImagesForSlug(
  productId: string,
  slug: string,
  productName: string,
) {
  const dir = resolve(process.cwd(), "public/products", slug);
  if (!existsSync(dir)) return 0;
  const files = readdirSync(dir)
    .filter((f) => /\.(webp|jpe?g|png)$/i.test(f))
    .sort();
  if (files.length === 0) return 0;

  const rows = files.map((file, i) => {
    const angulo = file.match(/^\d+-([a-z]+)\./i)?.[1] ?? "vista";
    return {
      product_id: productId,
      storage_path: `/products/${slug}/${file}`,
      alt_text: `Calcetines Kalcetos ${productName} — vista ${angulo}`,
      position: i,
      is_primary: i === 0,
    };
  });

  const { error } = await supabase.from("product_images").insert(rows);
  if (error) {
    console.error(`✗ Imágenes ${slug}: ${error.message}`);
    return 0;
  }
  return rows.length;
}

async function main() {
  const csvPath = resolve(process.cwd(), "scripts/producto.csv");
  const rows = parseCsv(readFileSync(csvPath, "utf8"));

  // Agrupar por modelo (preserva orden de aparición en el CSV).
  const groups = new Map<string, Row[]>();
  for (const row of rows) {
    const key = row.modelo;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(row);
  }

  console.log(
    `Importando ${groups.size} productos con ${rows.length} variantes en total\n`,
  );

  await wipeCatalog();

  let okProducts = 0;
  let okVariants = 0;
  let okImages = 0;
  let totalStock = 0;

  for (const [modelo, modelRows] of groups.entries()) {
    const base = modelRows[0];
    const product = await insertProduct(modelo, base.segmento, base);
    if (!product) continue;
    okProducts++;

    for (const row of modelRows) {
      if (await insertVariant(product.id, row)) {
        okVariants++;
        totalStock += Number.parseInt(row.stock, 10);
      }
    }

    const nImgs = await insertImagesForSlug(product.id, product.slug, modelo);
    okImages += nImgs;
    const stocks = modelRows
      .map((r) => `${r.stock}×${r.variante_talla}`)
      .join(" + ");
    console.log(
      `✓ ${modelo.padEnd(12)} (${product.slug.padEnd(10)}) — ${nImgs} imgs · ${stocks}`,
    );
  }

  console.log(`\nProductos: ${okProducts}/${groups.size}`);
  console.log(`Variantes: ${okVariants}/${rows.length}`);
  console.log(`Imágenes:  ${okImages}`);
  console.log(`Stock total: ${totalStock} unidades`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
