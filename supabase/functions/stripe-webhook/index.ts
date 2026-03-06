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

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "No signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        Deno.env.get("STRIPE_WEBHOOK_SECRET")!
      );
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};

      const orderId = metadata.order_id;
      const ticketTypeId = metadata.ticket_type_id;
      const quantity = parseInt(metadata.quantity || "1");

      if (orderId) {
        // Update order status
        await supabase
          .from("orders")
          .update({
            status: "completed",
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq("id", orderId);

        // Decrement ticket inventory
        if (ticketTypeId) {
          const { data: tt } = await supabase
            .from("ticket_types")
            .select("quantity_sold")
            .eq("id", ticketTypeId)
            .single();

          if (tt) {
            await supabase
              .from("ticket_types")
              .update({ quantity_sold: tt.quantity_sold + quantity })
              .eq("id", ticketTypeId);
          }
        }

        // Auto-RSVP the buyer
        const userId = metadata.user_id;
        const eventId = metadata.event_id;
        if (userId && eventId) {
          await supabase
            .from("event_rsvps")
            .upsert(
              { user_id: userId, event_id: eventId, status: "going" },
              { onConflict: "event_id,user_id" }
            );
        }
      }
    }

    if (event.type === "account.updated") {
      const account = event.data.object as Stripe.Account;
      if (account.charges_enabled && account.details_submitted) {
        await supabase
          .from("promoter_stripe_accounts")
          .update({ onboarding_complete: true, updated_at: new Date().toISOString() })
          .eq("stripe_account_id", account.id);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
