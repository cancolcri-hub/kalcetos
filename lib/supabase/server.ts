import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const SCHEMA = "kalcetos";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database, "kalcetos">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Llamado desde Server Component sin contexto de respuesta — ignorable.
          }
        },
      },
      db: { schema: SCHEMA },
    },
  );
}

// Cliente service-role: bypassa RLS. Usar SOLO en API routes y server actions.
// NUNCA importar este cliente desde un Client Component.
export function createServiceClient() {
  return createSupabaseClient<Database, "kalcetos">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      db: { schema: SCHEMA },
    },
  );
}
