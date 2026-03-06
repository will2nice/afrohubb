import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2024-12-18.acacia",
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { return_url, refresh_url } = await req.json();

    // Check if user already has an account
    const { data: existing } = await supabase
      .from("promoter_stripe_accounts")
      .select("*")
      .eq("user_id", userId)
      .single();

    let stripeAccountId: string;

    if (existing?.stripe_account_id) {
      stripeAccountId = existing.stripe_account_id;
    } else {
      // Create a new Stripe Connect Express account
      const account = await stripe.accounts.create({
        type: "express",
        metadata: { user_id: userId },
      });
      stripeAccountId = account.id;

      // Save to DB using service role to bypass RLS for insert
      const adminSupabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await adminSupabase.from("promoter_stripe_accounts").insert({
        user_id: userId,
        stripe_account_id: stripeAccountId,
        onboarding_complete: false,
      });
    }

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: refresh_url || "https://diaspora-vibe.lovable.app/?stripe_refresh=true",
      return_url: return_url || "https://diaspora-vibe.lovable.app/?stripe_onboard=complete",
      type: "account_onboarding",
    });

    return new Response(
      JSON.stringify({ url: accountLink.url, account_id: stripeAccountId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
