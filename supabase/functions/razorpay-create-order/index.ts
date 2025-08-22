// Deno / Supabase Edge Function
// Creates a Razorpay order and stores order_id on the "registrations" row.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RZP_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
const RZP_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

const corsHeaders: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Vary": "Origin",
  "Content-Type": "application/json",
};

function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers ?? {});
  for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
  return new Response(JSON.stringify(data), { ...init, headers });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders, status: 204 });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });

  try {
    const { registrationId } = await req.json().catch(() => ({}));
    if (!registrationId) return json({ error: "registrationId required" }, { status: 400 });

    const { data: reg, error: fetchErr } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", registrationId)
      .maybeSingle();

    if (fetchErr) return json({ error: "Failed to fetch registration" }, { status: 500 });
    if (!reg) return json({ error: "Registration not found" }, { status: 404 });
    if (reg.is_paid === true || reg.payment_status === "paid") {
      return json({ error: "Already paid" }, { status: 400 });
    }

    const fees = Number(reg.fees ?? 0);
    const amountInPaise = Math.max(1, Math.round(fees * 100)); // INR → paise

    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${RZP_KEY_ID}:${RZP_KEY_SECRET}`),
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `reg_${registrationId}`,
        payment_capture: 1,
        notes: {
          student_email: reg.email ?? "",
          student_name: reg.full_name ?? "",
        },
      }),
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      console.error("Razorpay order error:", orderData);
      return json({ error: "Failed to create order", details: orderData }, { status: 502 });
    }

    const { error: upErr } = await supabase
      .from("registrations")
      .update({ razorpay_order_id: orderData.id, payment_status: "pending" })
      .eq("id", registrationId);
    if (upErr) return json({ error: "Failed to store order id" }, { status: 500 });

    return json({
      ok: true,
      key_id: RZP_KEY_ID,
      order_id: orderData.id,
      amount: orderData.amount,     // paise
      currency: orderData.currency, // "INR"
    });
  } catch (e) {
    console.error("Unexpected error:", e);
    return json({ error: "Unexpected error" }, { status: 500 });
  }
});
