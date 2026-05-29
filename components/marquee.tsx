type Props = {
  items: string[];
  className?: string;
};

/**
 * Marquee horizontal infinito de proof points. CSS puro, sin JS.
 * Duplicamos los items para que el scroll sea continuo.
 */
export function Marquee({ items, className = "" }: Props) {
  return (
    <div
      className={`relative overflow-hidden bg-primary text-primary-foreground py-3 ${className}`}
    >
      <div className="flex gap-12 animate-marquee whitespace-nowrap will-change-transform">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-sm font-display font-bold uppercase tracking-wider flex items-center gap-12"
          >
            {item}
            <span aria-hidden className="text-amber-200">
              ★
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
