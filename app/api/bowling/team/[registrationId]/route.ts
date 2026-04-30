import { NextResponse } from "next/server";
import type { Bowler } from "@/lib/bowling/types";
import {
  getBowlingRegistration,
  isBowlingDatabaseConfigured,
  updateBowlingTeamDetails,
} from "@/lib/bowling/database";
import { buildBowlerList, getsTeamManagementLink } from "@/lib/bowling/validation";

export const runtime = "nodejs";

type TeamRouteProps = {
  params: Promise<{ registrationId: string }>;
};

type TeamUpdatePayload = {
  teamName?: string;
  bowlers?: Bowler[];
};

export async function GET(_request: Request, { params }: TeamRouteProps) {
  const { registrationId } = await params;

  if (!isBowlingDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured for live team updates." },
      { status: 501 },
    );
  }

  const registration = await getBowlingRegistration(registrationId);

  if (!registration) {
    return NextResponse.json({ error: "Team registration not found." }, { status: 404 });
  }

  if (!getsTeamManagementLink(registration.registrationType)) {
    return NextResponse.json(
      { error: "This registration does not include a public bowling team link." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    registration: {
      id: registration.id,
      teamName: registration.teamName,
      packageName: registration.packageName,
      sessionName: registration.sessionName,
      bowlers: buildBowlerList(registration.bowlers),
    },
  });
}

export async function PUT(request: Request, { params }: TeamRouteProps) {
  const { registrationId } = await params;

  if (!isBowlingDatabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured for live team updates." },
      { status: 501 },
    );
  }

  const registration = await getBowlingRegistration(registrationId);

  if (!registration) {
    return NextResponse.json({ error: "Team registration not found." }, { status: 404 });
  }

  if (!getsTeamManagementLink(registration.registrationType)) {
    return NextResponse.json(
      { error: "This registration does not include a public bowling team link." },
      { status: 400 },
    );
  }

  const payload = (await request.json().catch(() => ({}))) as TeamUpdatePayload;
  const bowlers = buildBowlerList(payload.bowlers ?? []);

  await updateBowlingTeamDetails(registrationId, {
    teamName: payload.teamName ?? "",
    bowlers,
  });

  return NextResponse.json({
    saved: true,
    registrationId,
    teamName: payload.teamName ?? "",
    bowlers,
  });
}
