import { NextResponse } from "next/server";
import { getStripe } from "@/lib/bowling/stripe";
import {
  deletePendingBowlingRegistration,
  getBowlingRegistration,
  updateBowlingRegistrationPayment,
} from "@/lib/bowling/database";
import { sendBowlingConfirmation } from "@/lib/bowling/send-confirmation";

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

      let emailStatus: string | undefined;

      if (registrationId) {
        await updateBowlingRegistrationPayment(registrationId, {
          paymentStatus: "paid",
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
        });

        // Send the confirmation email + PDF receipt now that the card payment
        // has succeeded. Load the persisted (now "paid") registration so the
        // receipt reflects the correct status. Never throws.
        const registration = await getBowlingRegistration(registrationId);

        if (registration) {
          const emailResult = await sendBowlingConfirmation(registration);
          emailStatus = emailResult.sent
            ? "sent"
            : emailResult.skipped
              ? "skipped"
              : "failed";

          if (!emailResult.sent && emailResult.skipped === false) {
            console.error(
              `[bowling] confirmation email failed for ${registrationId}: ${emailResult.error}`,
            );
          }
        }
      }

      return NextResponse.json({
        received: true,
        eventType: event.type,
        registrationId,
        paymentStatus: session.payment_status,
        confirmationEmail: emailStatus,
      });
    }
    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object;
      const registrationId = session.client_reference_id;

      if (registrationId) {
        await deletePendingBowlingRegistration(registrationId);
      }

      return NextResponse.json({
        received: true,
        eventType: event.type,
        registrationId,
        paymentStatus: session.payment_status,
        removedPendingRegistration: Boolean(registrationId),
      });
    }
    default:
      return NextResponse.json({ received: true, eventType: event.type });
  }
}
