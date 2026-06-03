import { NextResponse } from "next/server";
import type { BowlingRegistrationInput, BowlingRegistrationRecord } from "@/lib/bowling/types";
import {
  buildBowlingCheckoutLineItems,
  buildBowlingStripeMetadata,
  getStripe,
} from "@/lib/bowling/stripe";
import {
  getBowlingRegistrationByIdAndAccessToken,
  isBowlingDatabaseConfigured,
  updateBowlingRegistrationPayment,
} from "@/lib/bowling/database";
import { validateBowlingRegistrationInput } from "@/lib/bowling/validation";

export const runtime = "nodejs";

type BowlingCheckoutPayload = {
  registrationId?: string;
  accessToken?: string;
  registrationInput?: BowlingRegistrationInput;
  registration?: BowlingRegistrationRecord;
};

const getBaseUrl = (request: Request) => {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (!configuredUrl) {
    return new URL(request.url).origin;
  }

  return configuredUrl.startsWith("http") ? configuredUrl : `https://${configuredUrl}`;
};

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as BowlingCheckoutPayload;
  const registrationId = payload.registrationId ?? "BFB-PENDING";
  const fallbackRegistrationType =
    payload.registrationInput?.registrationType ?? payload.registration?.registrationType;
  const stripe = getStripe();

  if (!stripe) {
    const previewUrl = new URL("/bowling-for-backpacks/confirmation", "https://example.com");
    previewUrl.searchParams.set("registrationId", registrationId);
    previewUrl.searchParams.set("payment", "card");
    previewUrl.searchParams.set("checkout", "preview");

    if (payload.accessToken) {
      previewUrl.searchParams.set("token", payload.accessToken);
    }

    if (fallbackRegistrationType) {
      previewUrl.searchParams.set("type", fallbackRegistrationType);
    }

    return NextResponse.json({
      mode: "stripe-placeholder",
      url: `${previewUrl.pathname}${previewUrl.search}`,
      message:
        "Stripe is not configured. Returning a local confirmation URL for prototype testing.",
    });
  }

  const savedRegistration =
    registrationId !== "BFB-PENDING"
      ? await getBowlingRegistrationByIdAndAccessToken(registrationId, payload.accessToken ?? "")
      : null;

  if (registrationId !== "BFB-PENDING" && isBowlingDatabaseConfigured() && !savedRegistration) {
    return NextResponse.json(
      { error: "Registration link not found or no longer valid." },
      { status: 404 },
    );
  }

  const input = savedRegistration ?? payload.registrationInput ?? payload.registration;

  if (!input) {
    return NextResponse.json(
      { error: "Registration details are required to start Stripe Checkout." },
      { status: 400 },
    );
  }

  const validation = validateBowlingRegistrationInput(input, registrationId);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const registration = savedRegistration ?? validation.record;

  if (registration.paymentPreference !== "card") {
    return NextResponse.json(
      { error: "Stripe Checkout is only available for card payments." },
      { status: 400 },
    );
  }

  const lineItems = buildBowlingCheckoutLineItems(registration);

  if (lineItems.length === 0 || registration.grandTotal <= 0) {
    return NextResponse.json(
      { error: "Choose a registration, sponsorship, lane sponsorship, or gift amount before checkout." },
      { status: 400 },
    );
  }

  const baseUrl = getBaseUrl(request);
  const metadata = buildBowlingStripeMetadata(registration);
  const cancelUrl = new URL("/api/bowling/checkout/cancel", baseUrl);
  cancelUrl.searchParams.set("registrationId", registration.id);
  cancelUrl.searchParams.set("type", registration.registrationType);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: registration.id,
    customer_email: registration.buyerEmail.trim(),
    line_items: lineItems,
    metadata,
    payment_intent_data: {
      metadata,
    },
    success_url: `${baseUrl}/bowling-for-backpacks/confirmation?registrationId=${registration.id}&token=${registration.accessToken}&payment=card&type=${registration.registrationType}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl.toString(),
  });

  if (!checkoutSession.url) {
    return NextResponse.json(
      { error: "Stripe Checkout did not return a hosted checkout URL." },
      { status: 502 },
    );
  }

  await updateBowlingRegistrationPayment(registration.id, {
    paymentStatus: "pending",
    stripeCheckoutSessionId: checkoutSession.id,
    stripePaymentIntentId:
      typeof checkoutSession.payment_intent === "string"
        ? checkoutSession.payment_intent
        : checkoutSession.payment_intent?.id,
  });

  return NextResponse.json({
    mode: "stripe-checkout",
    registrationId: registration.id,
    accessToken: registration.accessToken,
    sessionId: checkoutSession.id,
    url: checkoutSession.url,
  });
}
