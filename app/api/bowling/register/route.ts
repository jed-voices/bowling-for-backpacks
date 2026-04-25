import { NextResponse } from "next/server";
import type { BowlingRegistrationInput } from "@/lib/bowling/types";
import {
  createBowlingRegistration,
  listBowlingRegistrations,
} from "@/lib/bowling/database";
import {
  needsSession,
  remainingLanesFromRegistrations,
  validateBowlingRegistrationInput,
} from "@/lib/bowling/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let input: BowlingRegistrationInput;

  try {
    input = (await request.json()) as BowlingRegistrationInput;
  } catch {
    return NextResponse.json(
      { errors: { form: "Registration payload could not be read." } },
      { status: 400 },
    );
  }

  const validation = validateBowlingRegistrationInput(input);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  try {
    const liveRegistrations = await listBowlingRegistrations();

    if (
      liveRegistrations &&
      needsSession(input.registrationType) &&
      remainingLanesFromRegistrations(input.sessionId, liveRegistrations) <= 0
    ) {
      return NextResponse.json(
        { errors: { sessionId: "This session is full. Choose another session or join the waitlist." } },
        { status: 400 },
      );
    }

    const result = await createBowlingRegistration(validation.record);

    return NextResponse.json({
      registration: result.registration,
      persisted: result.configured,
      message: result.configured
        ? "Registration saved."
        : "Static prototype response. Supabase persistence is not configured yet.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        errors: {
          form: error instanceof Error ? error.message : "Registration could not be saved.",
        },
      },
      { status: 500 },
    );
  }
}
