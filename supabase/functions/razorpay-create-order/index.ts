// Create a Razorpay order and return the key_id + order_id to the client.
// - CORS enabled
// - Uses LIVE or TEST creds based on env
// - Reads DB row (registration) to get the fee

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildCorsHeaders, handleOptions } from '../_shared/cors.ts';

type ReqBody = { registrationId?: string };
type ResBody =
  | { ok: true; key_id: string; order_id: string; amount: number; currency: string }
  | { ok: false; error: string; detail?: unknown };

// NOTE: Supabase injects SUPABASE_URL automatically.
// SERVICE_ROLE_KEY must be set via `supabase secrets set SERVICE_ROLE_KEY=...`
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!;

// Razorpay secrets: set these with `supabase secrets set ...`
const USE_LIVE = (Deno.env.get('RAZORPAY_USE_LIVE') || '').toLowerCase() === 'true'
  || (Deno.env.get('NODE_ENV') || '').toLowerCase() === 'production';

const RZP_KEY_ID_LIVE = Deno.env.get('RAZORPAY_KEY_ID_LIVE');
const RZP_KEY_SECRET_LIVE = Deno.env.get('RAZORPAY_KEY_SECRET_LIVE');
const RZP_KEY_ID_TEST = Deno.env.get('RAZORPAY_KEY_ID_TEST');
const RZP_KEY_SECRET_TEST = Deno.env.get('RAZORPAY_KEY_SECRET_TEST');

function getRazorpayCreds() {
  if (USE_LIVE) {
    if (!RZP_KEY_ID_LIVE || !RZP_KEY_SECRET_LIVE) throw new Error('Missing LIVE Razorpay secrets');
    return { key_id: RZP_KEY_ID_LIVE, key_secret: RZP_KEY_SECRET_LIVE };
  }
  if (!RZP_KEY_ID_TEST || !RZP_KEY_SECRET_TEST) throw new Error('Missing TEST Razorpay secrets');
  return { key_id: RZP_KEY_ID_TEST, key_secret: RZP_KEY_SECRET_TEST };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return handleOptions(req);

  const cors = buildCorsHeaders(req.headers.get('origin'));

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const { registrationId } = (await req.json()) as ReqBody;
    if (!registrationId) {
      return new Response(JSON.stringify({ ok: false, error: 'registrationId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data: row, error } = await supabase
      .from('registrations')
      .select('id, fees, gender')
      .eq('id', registrationId)
      .maybeSingle();

    if (error || !row) {
      return new Response(JSON.stringify({ ok: false, error: 'registration not found', detail: error }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const fees = typeof row.fees === 'number' && row.fees > 0
      ? row.fees
      : (String(row.gender || '').toLowerCase() === 'female' ? 250 : 350);
    const amountPaise = Math.round(fees * 100);

    const { key_id, key_secret } = getRazorpayCreds();

    // Create order
    const auth = 'Basic ' + btoa(`${key_id}:${key_secret}`);
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountPaise,
        currency: 'INR',
        receipt: registrationId,
        notes: { registrationId },
        payment_capture: 1,
      }),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      return new Response(JSON.stringify({ ok: false, error: 'razorpay order failed', detail: text }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const data = await r.json();
    const res: ResBody = {
      ok: true,
      key_id,
      order_id: data.id,
      amount: data.amount,
      currency: data.currency || 'INR',
    };
    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  } catch (e) {
    const res: ResBody = { ok: false, error: (e as Error).message };
    return new Response(JSON.stringify(res), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
});
