import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

const SCHEMA = "kalcetos";

export function createClient() {
  return createBrowserClient<Database, "kalcetos">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { db: { schema: SCHEMA } },
  );
}
