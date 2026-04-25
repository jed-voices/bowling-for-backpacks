import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as {
    registrationId?: string;
  };
  const registrationId = payload.registrationId ?? "preview-registration";

  if (process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Stripe credentials are present, but Checkout wiring is intentionally deferred for this prototype phase.",
      },
      { status: 501 },
    );
  }

  return NextResponse.json({
    mode: "stripe-placeholder",
    url: `/gala/confirmation?registrationId=${registrationId}&payment=card&checkout=preview`,
    message:
      "Stripe is not configured. Returning a local confirmation URL for prototype testing.",
  });
}
