// supabase/functions/admin-send-welcome/index.ts
// Sends a welcome email via Resend with CORS enabled — no external imports needed.

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const DEFAULT_FROM = Deno.env.get("FROM_EMAIL"); // e.g. 'NTExam <noreply@yourdomain.com>'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { from, to, name, registrationId } = await req.json();
    const sender = (from || DEFAULT_FROM || "").toString().trim();

    if (!sender || !to) {
      return new Response(JSON.stringify({ ok: false, error: "missing_from_or_to" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "missing_resend_api_key" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subject = "Welcome to NTExam 🎉";
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
        <h2>Welcome${name ? `, ${name}` : ""}!</h2>
        <p>Thank you for registering for <strong>NTExam (Navoday Talent Exam)</strong>.</p>
        ${registrationId ? `<p>Your registration ID: <strong>${registrationId}</strong></p>` : ""}
        <p>We’ll share your hall ticket and further instructions soon.</p>
        <p>Good luck!<br/>— NTExam Team</p>
      </div>
    `;

    // Send via Resend
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: sender, to, subject, html }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ ok: false, error: "send_failed", detail: data }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, id: data?.id ?? null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: "bad_request" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
