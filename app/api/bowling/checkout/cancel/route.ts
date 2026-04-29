import { NextResponse } from "next/server";
import { deletePendingBowlingRegistration } from "@/lib/bowling/database";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const registrationId = requestUrl.searchParams.get("registrationId");
  const registrationType = requestUrl.searchParams.get("type");

  if (registrationId) {
    await deletePendingBowlingRegistration(registrationId);
  }

  const redirectUrl = new URL("/bowling-for-backpacks", request.url);
  redirectUrl.searchParams.set("checkout", "cancelled");

  if (registrationType) {
    redirectUrl.searchParams.set("type", registrationType);
  }

  redirectUrl.hash = "registration";

  return NextResponse.redirect(redirectUrl);
}
