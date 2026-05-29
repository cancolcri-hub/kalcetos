import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/cookie-banner";
import { ConsentInit } from "@/components/consent-init";
import { MetaPixel } from "@/components/meta-pixel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Kalcetos";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kalcetos.shop";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Calcetines con personalidad`,
    template: `%s | ${siteName}`,
  },
  description:
    "Calcetines para adulto y niño. Comodidad, color y estilo. Envío rápido a toda España.",
  openGraph: {
    siteName,
    type: "website",
    locale: "es_ES",
    url: siteUrl,
  },
};

const LEGAL_LINKS = [
  { href: "/legal/aviso-legal", label: "Aviso legal" },
  { href: "/legal/privacidad", label: "Privacidad" },
  { href: "/legal/cookies", label: "Cookies" },
  { href: "/legal/devoluciones", label: "Devoluciones" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ConsentInit />
        <MetaPixel />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <footer className="border-t mt-16 bg-muted/20">
          <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <p className="font-bold text-base tracking-tight">{siteName}</p>
              <p className="mt-2 text-muted-foreground">
                Calcetines con carácter para los pies que importan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Tienda</h3>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  <Link href="/productos" className="hover:text-foreground">
                    Catálogo completo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/productos?segment=adulto"
                    className="hover:text-foreground"
                  >
                    Adulto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/productos?segment=nino"
                    className="hover:text-foreground"
                  >
                    Niño
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Legal</h3>
              <ul className="space-y-1 text-muted-foreground">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t">
            <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
              <p>
                © {new Date().getFullYear()} {siteName}. Todos los derechos
                reservados.
              </p>
              <p>Hecho con calma en Sevilla.</p>
            </div>
          </div>
        </footer>
        <Toaster richColors closeButton />
        <CookieBanner />
      </body>
    </html>
  );
}
