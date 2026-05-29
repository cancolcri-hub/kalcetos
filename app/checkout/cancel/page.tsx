import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">
        Pago cancelado
      </h1>
      <p className="mt-3 text-muted-foreground">
        No te preocupes — los productos siguen en tu carrito. Puedes retomar
        cuando quieras.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/carrito"
          className={buttonVariants({ size: "lg" })}
        >
          Volver al carrito
        </Link>
        <Link
          href="/productos"
          className={buttonVariants({ size: "lg", variant: "outline" })}
        >
          Seguir comprando
        </Link>
      </div>
    </section>
  );
}
