/// <reference lib="deno.ns" />
/// <reference lib="deno.window" />
/// <reference lib="dom" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RZP_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}
function toBase64(buf: ArrayBuffer) {
  let str = "";
  const arr = new Uint8Array(buf);
  for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
  // deno-lint-ignore no-deprecated-deno-api
  return btoa(str);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body ?? {};

    if (!registrationId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ ok: false, error: "missing_fields", body }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const msg = `${razorpay_order_id}|${razorpay_payment_id}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(RZP_KEY_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(msg));
    const expectedHex = toHex(sigBuf).toLowerCase();
    const expectedB64 = toBase64(sigBuf);

    const provided = String(razorpay_signature).trim();
    const providedLower = provided.toLowerCase();

    const match = (providedLower === expectedHex) || (provided === expectedB64);

    if (!match) {
      // Mark failed for visibility; DO NOT log secrets.
      await supabase
        .from("registrations")
        .update({
          payment_status: "failed",
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        })
        .eq("id", registrationId);

      return new Response(
        JSON.stringify({
          ok: false,
          error: "signature_mismatch",
          // Give enough debugging info (safe) to understand what's wrong:
          debug: {
            compare: "order_id|payment_id with HMAC-SHA256(secret)",
            expected_hex: expectedHex,
            expected_base64: expectedB64,
            provided
          }
        }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Mark paid
    const { error: upErr } = await supabase
      .from("registrations")
      .update({
        is_paid: true,
        payment_status: "paid",
        paid_at: new Date().toISOString(),
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      })
      .eq("id", registrationId);

    if (upErr) {
      return new Response(JSON.stringify({ ok: false, error: "db_update_failed", detail: upErr.message }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "unexpected", detail: String(e) }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
