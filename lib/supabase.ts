import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/** Maps frontend lot IDs to Supabase lot IDs */
const LOT_ID_MAP: Record<string, string> = {
  "lot-w": "W",
};

export function toSupabaseLotId(frontendId: string): string {
  return LOT_ID_MAP[frontendId] ?? frontendId;
}

export function toFrontendLotId(supabaseId: string): string {
  const entry = Object.entries(LOT_ID_MAP).find(([, v]) => v === supabaseId);
  return entry?.[0] ?? supabaseId;
}
