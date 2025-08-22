// Deno / Supabase Edge Function
// Verifies Razorpay signature and marks the registration row as paid.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

// These are automatically injected in the Edge Function environment by Supabase.
// You do NOT need to set SUPABASE_* via CLI secrets.
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Set this one as a secret: RAZORPAY_KEY_SECRET
const RZP_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      registrationId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!registrationId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Compute expected signature (HMAC-SHA256 of "order_id|payment_id" with key_secret)
    const msg = `${razorpay_order_id}|${razorpay_payment_id}`;
    const enc = new TextEncoder();

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      enc.encode(RZP_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
    const expectedHex = toHex(signature);

    if (expectedHex !== razorpay_signature) {
      // Signature mismatch → mark failed for visibility
      await supabase
        .from("registrations")
        .update({
          payment_status: "failed",
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        })
        .eq("id", registrationId);

      return new Response(JSON.stringify({ ok: false, error: "Signature mismatch" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Signature verified → mark paid
    const { error: upErr } = await supabase
      .from("registrations")
      .update({
        is_paid: true,
        payment_status: "paid",
        paid_at: new Date().toISOString(),
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })
      .eq("id", registrationId);

    if (upErr) {
      return new Response(JSON.stringify({ error: "Failed to update row" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
