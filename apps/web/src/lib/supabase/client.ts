'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

export function createSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey!,
  );

  return client;
}
