import { modelTheme } from "@/lib/format";

type Props = {
  slug: string;
  name: string;
  className?: string;
  showEmoji?: boolean;
  big?: boolean;
};

/**
 * Bloque de color "marca" usado en lugar de foto cuando no hay imagen
 * disponible (mientras SKILL 03 no genere las fotos definitivas, o cuando
 * un modelo aún no tenga foto subida a Supabase Storage).
 *
 * Pangaia / Marimekko vibe: color sólido o gradiente + nombre grande.
 */
export function ProductPlaceholder({
  slug,
  name,
  className = "",
  showEmoji = true,
  big = false,
}: Props) {
  const theme = modelTheme(slug);
  return (
    <div
      className={`relative flex flex-col items-center justify-center h-full w-full ${theme.bg} ${theme.text} ${className}`}
    >
      {showEmoji && (
        <span
          className={big ? "text-7xl mb-3 sm:text-8xl" : "text-4xl mb-1 sm:text-5xl"}
          aria-hidden
        >
          {theme.emoji}
        </span>
      )}
      <span
        className={`font-display font-black tracking-tight text-center px-4 leading-none ${big ? "text-5xl sm:text-7xl" : "text-2xl sm:text-3xl"}`}
      >
        {name}
      </span>
    </div>
  );
}
