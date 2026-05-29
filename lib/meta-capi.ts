/**
 * Meta Conversions API (CAPI) — eventos server-side.
 *
 * Es no-op si META_CAPI_ACCESS_TOKEN o NEXT_PUBLIC_META_PIXEL_ID no están
 * configurados, para que el webhook de Stripe no falle en entornos sin Meta.
 */

import { createHash } from "node:crypto";

type CapiEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "Purchase";

type CapiCustomData = {
  currency?: string;
  value?: number;
  content_ids?: string[];
  content_type?: "product" | "product_group";
  num_items?: number;
};

type CapiUserData = {
  email?: string;
  phone?: string;
  fbp?: string;
  fbc?: string;
  client_ip_address?: string;
  client_user_agent?: string;
};

function sha256(value: string): string {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function sendCapiEvent(
  eventName: CapiEventName,
  options: {
    eventId?: string;
    userData?: CapiUserData;
    customData?: CapiCustomData;
    sourceUrl?: string;
  } = {},
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !token) {
    return { ok: false, skipped: true };
  }

  const userData: Record<string, string | string[]> = {};
  if (options.userData?.email) userData.em = sha256(options.userData.email);
  if (options.userData?.phone) userData.ph = sha256(options.userData.phone);
  if (options.userData?.fbp) userData.fbp = options.userData.fbp;
  if (options.userData?.fbc) userData.fbc = options.userData.fbc;
  if (options.userData?.client_ip_address)
    userData.client_ip_address = options.userData.client_ip_address;
  if (options.userData?.client_user_agent)
    userData.client_user_agent = options.userData.client_user_agent;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: options.eventId,
        action_source: "website",
        event_source_url: options.sourceUrl,
        user_data: userData,
        custom_data: options.customData,
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error("CAPI error:", res.status, errText);
      return { ok: false, error: errText };
    }
    return { ok: true };
  } catch (err) {
    console.error("CAPI fetch failed:", err);
    return { ok: false, error: String(err) };
  }
}
