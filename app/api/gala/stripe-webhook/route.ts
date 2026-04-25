import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      status: "not_configured",
      message:
        "Stripe webhook handling will verify events, mark registrations paid, and activate chance-to-win entries after Stripe is wired.",
    },
    { status: 501 },
  );
}
