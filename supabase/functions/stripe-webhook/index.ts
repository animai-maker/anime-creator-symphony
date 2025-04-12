
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// The webhook doesn't need CORS headers as it's called by Stripe, not the browser

serve(async (req) => {
  try {
    // Get the signature from the header
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.log("No Stripe signature found");
      return new Response(JSON.stringify({ error: "No signature" }), { status: 400 });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.log("Stripe key not found in environment");
      return new Response(JSON.stringify({ error: "Configuration error" }), { status: 500 });
    }

    // Get the webhook secret from environment variables
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.log("Webhook secret not found in environment");
      // For now, we'll continue without verification since we haven't set up the webhook secret yet
      // In production, you should return an error here
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get the event data
    const body = await req.text();
    let event;

    try {
      if (webhookSecret) {
        // If we have a webhook secret, verify the signature
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        // For testing, just parse the JSON
        event = JSON.parse(body);
        console.log("Warning: Webhook signature not verified");
      }
    } catch (err) {
      console.log(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
    }

    console.log(`Received event: ${event.type}`);

    // Initialize Supabase client with service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      if (session.payment_status === 'paid') {
        console.log(`Payment succeeded for session: ${session.id}`);
        
        // Extract user_id and credits from metadata
        const userId = session.metadata?.user_id;
        const credits = parseInt(session.metadata?.credits || "0", 10);
        
        if (!userId) {
          console.log("User ID not found in session metadata");
          return new Response(JSON.stringify({ error: "User ID not found" }), { status: 400 });
        }

        if (credits <= 0) {
          console.log("Invalid credit amount in session metadata");
          return new Response(JSON.stringify({ error: "Invalid credit amount" }), { status: 400 });
        }

        console.log(`Adding ${credits} credits to user ${userId}`);

        // Check if user already has credits
        const { data: existingCredits, error: fetchError } = await supabaseAdmin
          .from('user_credits')
          .select('credits')
          .eq('id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          console.log("Error fetching user credits:", fetchError);
          return new Response(JSON.stringify({ error: "Database error" }), { status: 500 });
        }

        let updateResult;
        if (existingCredits) {
          // Update existing credits
          updateResult = await supabaseAdmin
            .from('user_credits')
            .update({ 
              credits: existingCredits.credits + credits,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
        } else {
          // Insert new credits record
          updateResult = await supabaseAdmin
            .from('user_credits')
            .insert({ 
              id: userId, 
              credits: credits,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
        }

        if (updateResult.error) {
          console.log("Error updating user credits:", updateResult.error);
          return new Response(JSON.stringify({ error: "Failed to update credits" }), { status: 500 });
        }

        // Add a payment record to track history
        const { error: paymentRecordError } = await supabaseAdmin
          .from('payment_history')
          .insert({
            user_id: userId,
            stripe_session_id: session.id,
            amount: session.amount_total / 100, // Convert from cents to dollars
            credits: credits,
            plan_id: session.metadata?.plan_id,
            created_at: new Date().toISOString()
          });

        if (paymentRecordError) {
          console.log("Error recording payment:", paymentRecordError);
          // Continue despite this error, since credits were already added
        }

        console.log(`Successfully added ${credits} credits to user ${userId}`);
      } else {
        console.log(`Payment not completed for session: ${session.id}`);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 500 }
    );
  }
});
