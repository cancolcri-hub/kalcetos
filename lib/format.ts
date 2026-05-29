const EUR = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatCents(cents: number): string {
  return EUR.format(cents / 100);
}

export function segmentLabel(segment: string): string {
  if (segment === "nino") return "Niño";
  if (segment === "adulto") return "Adulto";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Resuelve la URL de una imagen a partir del storage_path almacenado.
 * - Si empieza por '/' → ruta local servida desde public/ (test only).
 * - Si no → asume que es una key del bucket de Supabase Storage.
 */
export function imageUrl(storagePath: string): string {
  if (storagePath.startsWith("/")) return storagePath;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${storagePath}`;
}
