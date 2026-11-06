import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;
let signUpClient: SupabaseClient | null = null;

function readEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
  return { supabaseUrl, supabaseAnonKey };
}

export function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabase(): SupabaseClient {
  if (browserClient) return browserClient;
  const { supabaseUrl, supabaseAnonKey } = readEnv();
  browserClient = createClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}

export function getSignUpSupabase(): SupabaseClient {
  if (signUpClient) return signUpClient;
  const { supabaseUrl, supabaseAnonKey } = readEnv();
  signUpClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "shelflife-signup-ephemeral",
    },
  });
  return signUpClient;
}

