import { NextResponse } from "next/server";
import { getBowlingRegistrationByIdAndAccessToken } from "@/lib/bowling/database";
import { buildBowlingReceiptPdf } from "@/lib/bowling/receipt-pdf";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ registrationId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { registrationId } = await context.params;
  const token = new URL(request.url).searchParams.get("token") ?? "";

  if (!registrationId || !token) {
    return NextResponse.json(
      { error: "A registration id and access token are required." },
      { status: 400 },
    );
  }

  const registration = await getBowlingRegistrationByIdAndAccessToken(
    registrationId,
    token,
  ).catch(() => null);

  if (!registration) {
    return NextResponse.json(
      { error: "Receipt not found or the link is no longer valid." },
      { status: 404 },
    );
  }

  const pdf = await buildBowlingReceiptPdf(registration);

  return new NextResponse(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="city-center-receipt-${registration.id}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
