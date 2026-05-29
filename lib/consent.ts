/**
 * Gestión de consentimiento de cookies + Consent Mode V2.
 * Cliente puro — usa cookies para persistencia, no localStorage, porque queremos
 * que el banner respete la elección entre dispositivos del mismo navegador.
 */

export const CONSENT_COOKIE = "kalcetos-consent";
export const CONSENT_VERSION = "1";

export type ConsentChoice = {
  version: string;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  try {
    const value = decodeURIComponent(match.split("=")[1]);
    const parsed = JSON.parse(value) as ConsentChoice;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(choice: Omit<ConsentChoice, "version" | "necessary" | "timestamp">) {
  const full: ConsentChoice = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: choice.analytics,
    marketing: choice.marketing,
    timestamp: new Date().toISOString(),
  };
  const maxAge = 60 * 60 * 24 * 365; // 12 meses
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(full))}; path=/; max-age=${maxAge}; samesite=lax`;
  applyConsentMode(full);
  return full;
}

/**
 * Aplica Consent Mode V2 al estado actual del consentimiento.
 * Llamar siempre que cambie el consentimiento o al iniciar la página.
 */
export function applyConsentMode(choice: ConsentChoice | null) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer.push(args);
    };

  const granted = (b: boolean) => (b ? "granted" : "denied");
  // Si no hay elección aún, mantener todo denegado por defecto.
  const c = choice ?? {
    necessary: true as const,
    analytics: false,
    marketing: false,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  };

  window.gtag("consent", "update", {
    ad_storage: granted(c.marketing),
    ad_user_data: granted(c.marketing),
    ad_personalization: granted(c.marketing),
    analytics_storage: granted(c.analytics),
    functionality_storage: "granted",
    security_storage: "granted",
  });

  // Meta Pixel: grant/revoke según consentimiento de marketing.
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
  if (typeof fbq === "function") {
    fbq("consent", c.marketing ? "grant" : "revoke");
  }
}
