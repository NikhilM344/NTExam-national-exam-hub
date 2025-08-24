// Verify the Razorpay signature and mark the registration as paid
// - CORS enabled
// - Uses LIVE/TEST secret based on env
// - Web Crypto HMAC (no std imports)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildCorsHeaders, handleOptions } from '../_shared/cors.ts';

type ReqBody = {
  registrationId?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
};
type ResBody = { ok: true } | { ok: false; error: string; detail?: unknown };

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!;

const USE_LIVE = (Deno.env.get('RAZORPAY_USE_LIVE') || '').toLowerCase() === 'true'
  || (Deno.env.get('NODE_ENV') || '').toLowerCase() === 'production';

const RZP_KEY_SECRET_LIVE = Deno.env.get('RAZORPAY_KEY_SECRET_LIVE');
const RZP_KEY_SECRET_TEST = Deno.env.get('RAZORPAY_KEY_SECRET_TEST');

function getRazorpaySecret() {
  if (USE_LIVE) {
    if (!RZP_KEY_SECRET_LIVE) throw new Error('Missing LIVE Razorpay secret');
    return RZP_KEY_SECRET_LIVE;
  }
  if (!RZP_KEY_SECRET_TEST) throw new Error('Missing TEST Razorpay secret');
  return RZP_KEY_SECRET_TEST;
}

async function hmacSHA256Hex(secret: string, data: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
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

    const body = (await req.json()) as ReqBody;
    const { registrationId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!registrationId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const secret = getRazorpaySecret();
    const expected = await hmacSHA256Hex(secret, `${razorpay_order_id}|${razorpay_payment_id}`);
    const valid = expected === razorpay_signature;

    if (!valid) {
      return new Response(JSON.stringify({ ok: false, error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { error } = await supabase
      .from('registrations')
      .update({
        is_paid: true,
        paid_at: new Date().toISOString(),
        razorpay_order_id,
        razorpay_payment_id,
      })
      .eq('id', registrationId);

    if (error) {
      return new Response(JSON.stringify({ ok: false, error: 'DB update failed', detail: error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...cors },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }
});
