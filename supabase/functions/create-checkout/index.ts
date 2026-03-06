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

    const { ticket_type_id, quantity = 1, success_url, cancel_url } = await req.json();

    // Get ticket type with event info
    const { data: ticketType, error: ttErr } = await supabase
      .from("ticket_types")
      .select("*, events(*)")
      .eq("id", ticket_type_id)
      .single();

    if (ttErr || !ticketType) {
      return new Response(JSON.stringify({ error: "Ticket type not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = ticketType.events;
    const available = ticketType.quantity_total - ticketType.quantity_sold;
    if (quantity > available) {
      return new Response(JSON.stringify({ error: "Not enough tickets available" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate tiered application fee
    const capacity = event.capacity || 0;
    let applicationFeeCents = 200; // $2 default (under 400)
    if (capacity > 500) {
      applicationFeeCents = 500; // $5 for above 500
    } else if (capacity >= 400 && capacity <= 500) {
      applicationFeeCents = 200; // $2 for 400-500 range
    }

    // Multiply fee by quantity
    const totalApplicationFee = applicationFeeCents * quantity;

    // Get promoter's Stripe Connect account
    const { data: stripeAccount } = await supabase
      .from("promoter_stripe_accounts")
      .select("stripe_account_id, onboarding_complete")
      .eq("user_id", event.creator_id)
      .single();

    const totalCents = ticketType.price_cents * quantity;

    // Create order record
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        event_id: event.id,
        ticket_type_id,
        quantity,
        total_cents: totalCents,
        application_fee_cents: totalApplicationFee,
        status: "pending",
      })
      .select()
      .single();

    if (orderErr) {
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: ticketType.currency,
            product_data: {
              name: `${event.title} - ${ticketType.name}`,
              description: `${quantity}x ticket(s) for ${event.title}`,
            },
            unit_amount: ticketType.price_cents,
          },
          quantity,
        },
      ],
      metadata: {
        order_id: order.id,
        event_id: event.id,
        ticket_type_id,
        user_id: userId,
        quantity: String(quantity),
      },
      success_url: success_url || "https://diaspora-vibe.lovable.app/?checkout=success",
      cancel_url: cancel_url || "https://diaspora-vibe.lovable.app/?checkout=cancelled",
    };

    // If promoter has a connected Stripe account, use Connect
    if (stripeAccount?.stripe_account_id && stripeAccount.onboarding_complete) {
      sessionParams.payment_intent_data = {
        application_fee_amount: totalApplicationFee,
        transfer_data: {
          destination: stripeAccount.stripe_account_id,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Update order with session ID
    const adminSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    await adminSupabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
