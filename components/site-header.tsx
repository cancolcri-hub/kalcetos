import Link from "next/link";
import { CartDrawer } from "./cart-drawer";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Kalcetos";

export function SiteHeader() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 gap-4">
        <Link
          href="/"
          className="font-display font-black tracking-tighter text-2xl text-primary"
        >
          {siteName}
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
          <Link href="/productos" className="hover:text-primary transition-colors">
            Tienda
          </Link>
          <Link
            href="/productos?segment=adulto"
            className="hover:text-primary transition-colors"
          >
            Adulto
          </Link>
          <Link
            href="/productos?segment=nino"
            className="hover:text-primary transition-colors"
          >
            Niño
          </Link>
        </nav>
        <CartDrawer />
      </div>
    </header>
  );
}
