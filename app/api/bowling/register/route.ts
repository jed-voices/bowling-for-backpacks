import { NextResponse } from "next/server";
import type { BowlingRegistrationInput } from "@/lib/bowling/types";
import {
  createBowlingRegistration,
  listBowlingRegistrations,
} from "@/lib/bowling/database";
import { sendBowlingConfirmation } from "@/lib/bowling/send-confirmation";
import {
  needsSession,
  parseBowlingRegistrationInput,
  remainingLanesFromRegistrations,
  validateBowlingRegistrationInput,
} from "@/lib/bowling/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { errors: { form: "Registration payload could not be read." } },
      { status: 400 },
    );
  }

  const parsed = parseBowlingRegistrationInput(payload);

  if (!parsed.ok) {
    return NextResponse.json({ errors: parsed.errors }, { status: 400 });
  }

  const input: BowlingRegistrationInput = parsed.input;

  const validation = validateBowlingRegistrationInput(input);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  try {
    const liveRegistrations = await listBowlingRegistrations();

    if (
      liveRegistrations &&
      needsSession(input.registrationType) &&
      remainingLanesFromRegistrations(input.sessionId, liveRegistrations) <
        Math.max(1, validation.record.laneCount)
    ) {
      return NextResponse.json(
        {
          errors: {
            sessionId:
              validation.record.laneCount > 1
                ? `This session does not have ${validation.record.laneCount} lanes available. Choose another session or contact City Center.`
                : "This session is full. Choose another session or join the waitlist.",
          },
        },
        { status: 400 },
      );
    }

    const result = await createBowlingRegistration(validation.record);

    // Card payments send their confirmation from the Stripe webhook once the
    // payment succeeds. Invoice/check registrations are final at this point, so
    // send the confirmation email + PDF receipt now. sendBowlingConfirmation
    // never throws and skips gracefully when SMTP is not configured.
    if (result.registration.paymentPreference !== "card") {
      const emailResult = await sendBowlingConfirmation(result.registration);

      if (!emailResult.sent && emailResult.skipped === false) {
        console.error(
          `[bowling] confirmation email failed for ${result.registration.id}: ${emailResult.error}`,
        );
      }
    }

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
