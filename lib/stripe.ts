import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
  typescript: true,
  appInfo: {
    name: "Kalcetos",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kalcetos.shop",
  },
});
