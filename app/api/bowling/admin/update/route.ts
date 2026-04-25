import { NextResponse } from "next/server";
import { updateBowlingRegistrationPayment, updateBowlingRegistrationExportStatus } from "@/lib/bowling/database";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
  const body = await request.json();

  if (!ADMIN_SECRET || body.secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, registrationId } = body;

  if (!registrationId) {
    return NextResponse.json({ error: "Missing registrationId" }, { status: 400 });
  }

  try {
    if (action === "mark-paid") {
      await updateBowlingRegistrationPayment(registrationId, { paymentStatus: "paid" });
      return NextResponse.json({ success: true });
    }

    if (action === "mark-exported") {
      await updateBowlingRegistrationExportStatus(registrationId, "exported");
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
