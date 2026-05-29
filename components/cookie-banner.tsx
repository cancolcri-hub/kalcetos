"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { readConsent, writeConsent } from "@/lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const choice = readConsent();
    if (!choice) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    writeConsent({ analytics: true, marketing: true });
    setVisible(false);
  };
  const rejectAll = () => {
    writeConsent({ analytics: false, marketing: false });
    setVisible(false);
  };
  const saveCustom = () => {
    writeConsent({ analytics, marketing });
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto max-w-4xl px-4 py-5">
        {!configuring ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <h2 id="cookie-title" className="font-semibold">
                Cookies en Kalcetos
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Usamos cookies técnicas (necesarias para el carrito y el pago) y,
                con tu permiso, cookies analíticas y de marketing para medir y
                mejorar la tienda.{" "}
                <Link
                  href="/legal/cookies"
                  className="underline text-foreground"
                >
                  Más info
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setConfiguring(true)}
                className="w-full sm:w-auto"
              >
                Configurar
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={rejectAll}
                className="w-full sm:w-auto"
              >
                Rechazar todas
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={acceptAll}
                className="w-full sm:w-auto"
              >
                Aceptar todas
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="font-semibold">Configurar cookies</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start justify-between gap-4 py-2 border-b">
                <div>
                  <p className="font-medium">Necesarias</p>
                  <p className="text-muted-foreground text-xs">
                    Imprescindibles para que la tienda funcione (carrito, pago,
                    sesión). Siempre activas.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 h-4 w-4 accent-primary"
                  aria-label="Cookies necesarias (siempre activas)"
                />
              </li>
              <li className="flex items-start justify-between gap-4 py-2 border-b">
                <div>
                  <p className="font-medium">Analíticas</p>
                  <p className="text-muted-foreground text-xs">
                    Nos ayudan a entender qué páginas funcionan mejor y dónde
                    mejorar. Datos anonimizados.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                  aria-label="Cookies analíticas"
                />
              </li>
              <li className="flex items-start justify-between gap-4 py-2">
                <div>
                  <p className="font-medium">Marketing</p>
                  <p className="text-muted-foreground text-xs">
                    Permiten medir la efectividad de nuestros anuncios en Meta
                    y mostrarte contenido relevante.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-primary"
                  aria-label="Cookies de marketing"
                />
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                onClick={() => setConfiguring(false)}
              >
                Volver
              </Button>
              <Button type="button" size="lg" onClick={saveCustom}>
                Guardar elección
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
