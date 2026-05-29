/**
 * scripts/upload-images.ts
 *
 * Sube todas las imágenes de public/products/{slug}/ al bucket
 * kalcetos-product-images de Supabase Storage, y actualiza el campo
 * storage_path en kalcetos.product_images para apuntar al bucket.
 *
 * Uso: npx tsx scripts/upload-images.ts
 *
 * Idempotente: si ya existe el archivo en el bucket, hace upsert.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve, extname } from "node:path";
import { config as loadEnv } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types";

loadEnv({ path: ".env.local" });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRole) {
  console.error("✗ Falta URL o SERVICE_ROLE en .env.local");
  process.exit(1);
}

const BUCKET = "kalcetos-product-images";

const supabase = createClient<Database, "kalcetos">(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: "kalcetos" },
});

const storage = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function mimeFor(file: string): string {
  const ext = extname(file).toLowerCase();
  if (ext === ".webp") return "image/webp";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

async function uploadSlug(slug: string): Promise<{ uploaded: number }> {
  const dir = resolve(process.cwd(), "public/products", slug);
  if (!existsSync(dir)) return { uploaded: 0 };
  const files = readdirSync(dir)
    .filter((f) => /\.(webp|jpe?g|png)$/i.test(f))
    .sort();

  let uploaded = 0;
  for (const file of files) {
    const body = readFileSync(resolve(dir, file));
    const path = `${slug}/${file}`;
    const { error } = await storage.storage
      .from(BUCKET)
      .upload(path, body, {
        upsert: true,
        contentType: mimeFor(file),
        cacheControl: "31536000",
      });
    if (error) {
      console.error(`  ✗ ${path}: ${error.message}`);
      continue;
    }
    uploaded++;
  }
  return { uploaded };
}

async function updateDbPaths() {
  // Actualizar product_images: cambiar '/products/{slug}/...' a '{slug}/...'.
  const { data: rows, error } = await supabase
    .from("product_images")
    .select("id, storage_path");
  if (error || !rows) {
    console.error("✗ Error leyendo product_images:", error);
    return 0;
  }
  let updated = 0;
  for (const row of rows) {
    if (!row.storage_path.startsWith("/products/")) continue;
    const newPath = row.storage_path.slice("/products/".length); // → "slug/file"
    const { error: upErr } = await supabase
      .from("product_images")
      .update({ storage_path: newPath })
      .eq("id", row.id);
    if (upErr) {
      console.error(`  ✗ update ${row.id}: ${upErr.message}`);
      continue;
    }
    updated++;
  }
  return updated;
}

async function main() {
  const slugs = ["arcoiris", "donuts", "guindilla", "patos", "rayas", "virus"];
  console.log(`Subiendo imágenes al bucket ${BUCKET}...\n`);

  let totalUploaded = 0;
  for (const slug of slugs) {
    const r = await uploadSlug(slug);
    totalUploaded += r.uploaded;
    console.log(`✓ ${slug}: ${r.uploaded} imágenes subidas`);
  }

  console.log(`\nActualizando storage_path en BD...`);
  const updated = await updateDbPaths();
  console.log(`✓ ${updated} filas actualizadas en product_images`);

  console.log(`\n📊 Total: ${totalUploaded} archivos subidos`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
