// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
}

// Use local Edge Functions ONLY in dev when explicitly enabled
const useLocalFns =
  import.meta.env.DEV &&
  String(import.meta.env.VITE_USE_LOCAL_FUNCTIONS || '').toLowerCase() === 'true';

const options: Parameters<typeof createClient>[2] = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'x-client-info': 'ntexam-web',
    },
  },
  ...(useLocalFns
    ? {
        functions: {
          // Supabase CLI serves functions here by default
          url: 'http://localhost:54321/functions/v1',
        },
      }
    : {}),
};

export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', options);
