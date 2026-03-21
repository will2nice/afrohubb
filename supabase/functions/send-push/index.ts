import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Web Push helpers using Web Crypto API
async function importVapidKeys(publicKey: string, privateKey: string) {
  const pubRaw = base64urlToBuffer(publicKey);
  const privRaw = base64urlToBuffer(privateKey);
  const cryptoPrivateKey = await crypto.subtle.importKey(
    "raw",
    privRaw,
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign"]
  );
  return { publicKey: pubRaw, privateKey: cryptoPrivateKey };
}

function base64urlToBuffer(b64url: string): ArrayBuffer {
  const padding = "=".repeat((4 - (b64url.length % 4)) % 4);
  const b64 = (b64url + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function bufferToBase64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function createVapidJwt(
  audience: string,
  subject: string,
  privateKey: CryptoKey
): Promise<string> {
  const header = { typ: "JWT", alg: "ES256" };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    sub: subject,
  };
  const encoder = new TextEncoder();
  const headerB64 = bufferToBase64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = bufferToBase64url(encoder.encode(JSON.stringify(payload)));
  const input = encoder.encode(`${headerB64}.${payloadB64}`);

  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privateKey, input);

  // Convert DER to raw r||s
  const sigBytes = new Uint8Array(sig);
  let r: Uint8Array, s: Uint8Array;
  if (sigBytes.length === 64) {
    r = sigBytes.slice(0, 32);
    s = sigBytes.slice(32);
  } else {
    // DER format
    const rLen = sigBytes[3];
    const rStart = 4;
    r = sigBytes.slice(rStart, rStart + rLen);
    const sLen = sigBytes[rStart + rLen + 1];
    s = sigBytes.slice(rStart + rLen + 2, rStart + rLen + 2 + sLen);
    // Trim leading zeros, pad to 32
    if (r.length > 32) r = r.slice(r.length - 32);
    if (s.length > 32) s = s.slice(s.length - 32);
  }
  const rawSig = new Uint8Array(64);
  rawSig.set(r.length < 32 ? r : r.slice(r.length - 32), 32 - Math.min(r.length, 32));
  rawSig.set(s.length < 32 ? s : s.slice(s.length - 32), 64 - Math.min(s.length, 32));

  return `${headerB64}.${payloadB64}.${bufferToBase64url(rawSig.buffer)}`;
}

async function sendWebPush(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: CryptoKey
): Promise<boolean> {
  try {
    const url = new URL(subscription.endpoint);
    const audience = `${url.protocol}//${url.host}`;
    const jwt = await createVapidJwt(audience, "mailto:hello@afrohub.app", vapidPrivateKey);
    const vapidPubB64 = bufferToBase64url(
      base64urlToBuffer(vapidPublicKey)
    );

    const resp = await fetch(subscription.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        TTL: "86400",
        Authorization: `vapid t=${jwt}, k=${vapidPublicKey}`,
      },
      body: new TextEncoder().encode(payload),
    });

    if (resp.status === 410 || resp.status === 404) {
      return false; // subscription expired
    }
    return resp.ok;
  } catch (e) {
    console.error("Push send failed:", e);
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { user_id, title, body, type, data } = await req.json();

    if (!user_id || !title) {
      return new Response(JSON.stringify({ error: "user_id and title required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's push subscriptions
    const { data: subs, error: subErr } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("user_id", user_id);

    if (subErr || !subs?.length) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, reason: "no_subscriptions" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const keys = await importVapidKeys(vapidPublicKey, vapidPrivateKey);
    const payload = JSON.stringify({
      title,
      body: body || "",
      tag: type || "general",
      data: data || {},
    });

    let sent = 0;
    const expiredEndpoints: string[] = [];

    for (const sub of subs) {
      const ok = await sendWebPush(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payload,
        vapidPublicKey,
        keys.privateKey
      );
      if (ok) {
        sent++;
      } else {
        expiredEndpoints.push(sub.endpoint);
      }
    }

    // Clean up expired subscriptions
    if (expiredEndpoints.length > 0) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .in("endpoint", expiredEndpoints);
    }

    return new Response(JSON.stringify({ success: true, sent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-push error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
