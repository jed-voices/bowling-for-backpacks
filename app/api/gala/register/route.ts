import { NextResponse } from "next/server";
import type { GalaRegistrationInput } from "@/lib/gala/types";
import { validateRegistrationInput } from "@/lib/gala/validation";

export async function POST(request: Request) {
  let input: GalaRegistrationInput;

  try {
    input = (await request.json()) as GalaRegistrationInput;
  } catch {
    return NextResponse.json(
      { errors: { form: "Registration payload could not be read." } },
      { status: 400 },
    );
  }

  const validation = validateRegistrationInput(input);

  if (!validation.ok) {
    return NextResponse.json({ errors: validation.errors }, { status: 400 });
  }

  return NextResponse.json({
    registration: validation.record,
    persisted: false,
    message:
      "Static prototype response. Supabase persistence will be connected in the next phase.",
  });
}
