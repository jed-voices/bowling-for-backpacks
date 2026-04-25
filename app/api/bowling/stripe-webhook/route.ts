import { NextResponse } from "next/server";
import { getStripe } from "@/lib/bowling/stripe";
import { updateBowlingRegistrationPayment } from "@/lib/bowling/database";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      {
        status: "not_configured",
        message: "Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to verify Bowling webhook events.",
      },
      { status: 501 },
    );
  }

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature.";

    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      const registrationId = session.client_reference_id;
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      if (registrationId) {
        await updateBowlingRegistrationPayment(registrationId, {
          paymentStatus: "paid",
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
        });
      }

      return NextResponse.json({
        received: true,
        eventType: event.type,
        registrationId,
        paymentStatus: session.payment_status,
      });
    }
    case "checkout.session.async_payment_failed": {
      const session = event.data.object;
      const registrationId = session.client_reference_id;
      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      if (registrationId) {
        await updateBowlingRegistrationPayment(registrationId, {
          paymentStatus: "pending",
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
        });
      }

      return NextResponse.json({
        received: true,
        eventType: event.type,
        registrationId,
        paymentStatus: session.payment_status,
      });
    }
    default:
      return NextResponse.json({ received: true, eventType: event.type });
  }
}
