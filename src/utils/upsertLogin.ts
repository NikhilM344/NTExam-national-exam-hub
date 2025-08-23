// utils/upsertLogin.ts
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

/**
 * Upsert a login row keyed by normalized phone.
 * - Email is optional (can be null)
 * - Password is stored as a bcrypt hash in `password_hash`
 * - DO NOT include `contact_number_normalized` in payload
 */
export async function upsertLoginByPhone(params: {
  fullName?: string | null;
  contactNumber: string;          // required
  email?: string | null;          // optional
  rawPassword: string;            // required
}) {
  const fullName = params.fullName?.trim() || null;
  const contactNumber = params.contactNumber.trim();
  const email = params.email ? params.email.trim().toLowerCase() : null;

  if (!contactNumber) throw new Error("Mobile number is required.");
  if (!params.rawPassword?.trim()) throw new Error("Password is required.");

  const password_hash = await bcrypt.hash(params.rawPassword, 10);

  const row = {
    full_name: fullName,
    contact_number: contactNumber, // raw; generated column will compute normalized
    email,                         // may be null
    password_hash,                 // bcrypt string
  };

  const { data, error } = await supabase
    .from("logins")
    .upsert(row, { onConflict: "contact_number_normalized" }) // <- conflict target is the generated col
    .select()
    .single();

  if (error) throw error;
  return data;
}
