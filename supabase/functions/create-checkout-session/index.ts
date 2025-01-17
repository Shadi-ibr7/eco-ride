import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { stripe } from "../_shared/stripe.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  console.log("Function called with method:", req.method)
  
  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS request")
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    console.log("Starting to process request body")
    const { rideId, price, departure_city, arrival_city, success_url, cancel_url } = await req.json()

    console.log("Request parameters:", {
      rideId,
      price,
      departure_city,
      arrival_city,
      success_url,
      cancel_url
    })

    // Validate required fields
    if (!rideId || !departure_city || !arrival_city || !success_url || !cancel_url) {
      console.error("Missing required fields:", { rideId, departure_city, arrival_city, success_url, cancel_url })
      throw new Error("Missing required fields")
    }

    // Ensure price is a valid number and convert to cents for Stripe
    const amount = Math.round(Number(price) * 100)
    if (isNaN(amount) || amount <= 0) {
      console.error("Invalid price amount:", price)
      throw new Error("Invalid price amount")
    }

    console.log("Creating Stripe session with amount:", amount)

    // Clean up URLs by removing any trailing colons, ports, and ensuring proper formatting
    const cleanUrl = (url: string) => {
      return new URL(url).origin + new URL(url).pathname;
    };

    const cleanSuccessUrl = `${cleanUrl(success_url)}/rides/${rideId}?success=true`;
    const cleanCancelUrl = `${cleanUrl(cancel_url)}/rides/${rideId}?canceled=true`;

    console.log("Cleaned URLs:", {
      successUrl: cleanSuccessUrl,
      cancelUrl: cleanCancelUrl
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Trajet de ${departure_city} à ${arrival_city}`,
              description: `Réservation de votre trajet en covoiturage`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: cleanSuccessUrl,
      cancel_url: cleanCancelUrl,
      metadata: {
        rideId,
        departure_city,
        arrival_city
      },
      submit_type: "pay",
      payment_intent_data: {
        capture_method: "automatic",
      },
      locale: "fr"
    })

    console.log("Checkout session created successfully:", {
      sessionId: session.id,
      url: session.url
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error in create-checkout-session:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})