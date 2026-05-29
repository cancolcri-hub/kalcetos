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
 * - Si empieza por '/' → ruta local servida desde public/. En producción
 *   estos paths NO existen (gitignored por copyright) → devolvemos null para
 *   que el cliente caiga al ProductPlaceholder.
 * - Si no → key del bucket Supabase Storage; siempre devolvemos URL completa.
 */
const STORAGE_BUCKET = "kalcetos-product-images";

export function imageUrl(storagePath: string): string | null {
  if (storagePath.startsWith("/")) {
    if (process.env.NODE_ENV === "production") return null;
    return storagePath;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${supabaseUrl}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
}

/**
 * Color "alma" de cada modelo. Se usa para los placeholders visuales y los
 * acentos en cards / hero. Pensado para encajar con la paleta primary del tema
 * (rojo guindilla) sin chocar.
 */
export type ModelTheme = {
  bg: string;        // tailwind class para fondo del placeholder
  text: string;      // tailwind class para texto sobre ese fondo
  accent: string;    // hex que también podemos usar para chips
  emoji: string;     // emoji indicativo (sutil)
};

const MODEL_THEMES: Record<string, ModelTheme> = {
  guindilla: {
    bg: "bg-[#DC2626]",
    text: "text-white",
    accent: "#DC2626",
    emoji: "🌶",
  },
  donuts: {
    bg: "bg-[#FF6BB0]",
    text: "text-white",
    accent: "#FF6BB0",
    emoji: "🍩",
  },
  arcoiris: {
    bg: "bg-gradient-to-br from-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500",
    text: "text-white",
    accent: "#A855F7",
    emoji: "🌈",
  },
  virus: {
    bg: "bg-[#22C55E]",
    text: "text-white",
    accent: "#22C55E",
    emoji: "👾",
  },
  rayas: {
    bg: "bg-[#1E4D62]",
    text: "text-white",
    accent: "#1E4D62",
    emoji: "🐟",
  },
  patos: {
    bg: "bg-[#FCD34D]",
    text: "text-zinc-900",
    accent: "#FCD34D",
    emoji: "🦆",
  },
};

const DEFAULT_THEME: ModelTheme = {
  bg: "bg-zinc-200",
  text: "text-zinc-900",
  accent: "#71717A",
  emoji: "🧦",
};

export function modelTheme(slug: string): ModelTheme {
  return MODEL_THEMES[slug] ?? DEFAULT_THEME;
}
