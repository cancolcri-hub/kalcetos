import Link from "next/link";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <nav className="text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:underline">
          ← Volver a la tienda
        </Link>
      </nav>
      <div className="space-y-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_ul]:text-muted-foreground [&_a]:text-primary [&_a]:underline [&_table]:w-full [&_table]:text-sm [&_table]:border [&_th]:text-left [&_th]:p-2 [&_th]:border-b [&_th]:bg-muted [&_td]:p-2 [&_td]:border-b">
        {children}
      </div>
    </section>
  );
}
