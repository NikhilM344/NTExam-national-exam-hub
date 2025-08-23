/// <reference lib="deno.ns" />
/// <reference lib="deno.window" />
/// <reference lib="dom" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RZP_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
const RZP_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function fallbackFee(gender: string | null | undefined) {
  const g = (gender || "").toLowerCase();
  return g === "female" ? 250 : 350; // adjust if your pricing differs
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { registrationId } = await req.json();
    if (!registrationId) {
      return new Response(JSON.stringify({ ok: false, error: "missing_registrationId" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Get fee & gender to compute amount (paise)
    const { data: reg, error } = await supabase
      .from("registrations")
      .select("id, fees, gender")
      .eq("id", registrationId)
      .single();

    if (error || !reg) {
      return new Response(JSON.stringify({ ok: false, error: "registration_not_found" }), {
        status: 404, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const rupees =
      typeof reg.fees === "number" && reg.fees > 0 ? reg.fees : fallbackFee(reg.gender);
    const paise = rupees * 100;

    // Create Razorpay order
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`)
      },
      body: JSON.stringify({
        amount: paise,
        currency: "INR",
        receipt: registrationId,
        notes: { registrationId }
      })
    });

    const orderJson = await orderRes.json();

    if (!orderRes.ok) {
      // Bubble up Razorpay message to the client for easy debugging
      return new Response(JSON.stringify({ ok: false, error: "rzp_order_failed", detail: orderJson }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    // Store order id (optional but useful)
    await supabase
      .from("registrations")
      .update({ razorpay_order_id: orderJson.id, payment_status: "created" })
      .eq("id", registrationId);

    return new Response(JSON.stringify({
      ok: true,
      key_id: RZP_KEY_ID,
      order_id: orderJson.id,
      amount: orderJson.amount,
      currency: orderJson.currency
    }), { headers: { "Content-Type": "application/json", ...corsHeaders } });

  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: "unexpected", detail: String(e) }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
