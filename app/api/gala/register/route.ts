import { NextResponse } from "next/server";
import type { GalaRegistrationInput } from "@/lib/gala/types";
import { buildGalaAccessToken } from "@/lib/gala/entitlement";
import { parseGalaRegistrationInput, validateRegistrationInput } from "@/lib/gala/validation";

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

  const parsed = parseGalaRegistrationInput(payload);

  if (!parsed.ok) {
    return NextResponse.json({ errors: parsed.errors }, { status: 400 });
  }

  const input: GalaRegistrationInput = parsed.input;

  const validation = validateRegistrationInput(input);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  const registration = {
    ...validation.record,
    accessToken: buildGalaAccessToken(validation.record.id),
  };

  return NextResponse.json({
    registration,
    persisted: false,
    message:
      "Static prototype response. Supabase persistence will be connected in the next phase.",
  });
}
