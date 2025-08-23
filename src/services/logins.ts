import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function upsertLoginByPhone({
  fullName,
  phone,
  email,
  rawPassword,
}: {
  fullName?: string | null;
  phone: string;                 // required
  email?: string | null;         // optional
  rawPassword: string;           // required (will be hashed)
}) {
  if (!phone?.trim()) throw new Error("Mobile number is required");
  if (!rawPassword?.trim()) throw new Error("Password is required");

  const password_hash = await bcrypt.hash(rawPassword, 10);

  const row = {
    full_name: fullName ?? null,
    contact_number: phone.trim(),               // DO NOT send generated cols
    email: email ? email.trim().toLowerCase() : null,
    password_hash,
  };

  // <-- HERE is the onConflict option
  const { data, error } = await supabase
    .from("logins")
    .upsert(row, { onConflict: "contact_number_normalized" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
