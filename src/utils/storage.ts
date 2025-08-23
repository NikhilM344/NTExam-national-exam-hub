// utils/storage.ts
import { supabase } from "@/lib/supabase";

export function getPublicUrlFromStoragePath(storagePath: string | null | undefined) {
  const key = (storagePath || "").replace(/^\/+/, ""); // strip accidental leading slash
  if (!key) return "";
  const { data } = supabase.storage.from("gallery").getPublicUrl(key);
  return data?.publicUrl || "";
}
