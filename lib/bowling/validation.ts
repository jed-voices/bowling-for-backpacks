import {
  bowlingEventConfig,
  getRegistrationOptionById,
  getSessionById,
  getSponsorshipById,
  teamRegistration,
} from "./config";
import type {
  Bowler,
  BowlingPaymentStatus,
  BowlingRegistrationInput,
  BowlingRegistrationRecord,
} from "./types";

export type BowlingValidationResult =
  | { ok: true; record: BowlingRegistrationRecord }
  | { ok: false; errors: Record<string, string> };

export const blankBowler = (): Bowler => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  notes: "",
});

export const buildBowlerList = (existing: Bowler[] = []) =>
  Array.from({ length: bowlingEventConfig.teamSize }, (_, index) => existing[index] ?? blankBowler());

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

export const remainingLanes = (sessionId: string) => {
  const session = getSessionById(sessionId);

  if (!session) {
    return 0;
  }

  return Math.max(0, session.laneCapacity - session.registeredTeams);
};

export const remainingLanesFromRegistrations = (
  sessionId: string,
  registrations: BowlingRegistrationRecord[],
) => {
  const session = getSessionById(sessionId);

  if (!session) {
    return 0;
  }

  const heldLanes = registrations
    .filter((registration) => registration.sessionId === sessionId && needsSession(registration.registrationType))
    .reduce((sum, registration) => sum + Math.max(1, registration.laneCount), 0);

  return Math.max(0, session.laneCapacity - heldLanes);
};

export const needsSession = (registrationType: BowlingRegistrationInput["registrationType"]) =>
  registrationType === "team" || registrationType === "sponsorship";

export const selectedPrice = (input: BowlingRegistrationInput) => {
  if (input.registrationType === "team") {
    return teamRegistration.price;
  }

  if (input.registrationType === "sponsorship" || input.registrationType === "lane-sponsor") {
    return getSponsorshipById(input.packageId)?.price ?? 0;
  }

  return 0;
};

export const selectedName = (input: BowlingRegistrationInput) => {
  if (input.registrationType === "team") {
    return teamRegistration.name;
  }

  if (input.registrationType === "sponsorship" || input.registrationType === "lane-sponsor") {
    return getSponsorshipById(input.packageId)?.name ?? "Sponsorship";
  }

  return getRegistrationOptionById("gift")?.name ?? "Make a Gift";
};

export const getPaymentStatus = (
  paymentPreference: BowlingRegistrationInput["paymentPreference"],
): BowlingPaymentStatus => {
  if (paymentPreference === "invoice") {
    return "invoice_requested";
  }

  if (paymentPreference === "check") {
    return "check_pledged";
  }

  return "pending";
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const confirmationAlphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export const buildBowlingConfirmationCode = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  const code = Array.from(
    bytes,
    (byte) => confirmationAlphabet[byte % confirmationAlphabet.length],
  ).join("");

  return `BFB-${code}`;
};

export const validateBowlingRegistrationInput = (
  input: BowlingRegistrationInput,
  id = buildBowlingConfirmationCode(),
): BowlingValidationResult => {
  const errors: Record<string, string> = {};
  const requiresSession = needsSession(input.registrationType);
  const session = input.sessionId ? getSessionById(input.sessionId) : undefined;

  if (!input.buyerFirstName.trim()) {
    errors.buyerFirstName = "First name is required.";
  }

  if (!input.buyerLastName.trim()) {
    errors.buyerLastName = "Last name is required.";
  }

  if (!emailPattern.test(input.buyerEmail.trim())) {
    errors.buyerEmail = "A valid email is required.";
  }

  if (!["team", "sponsorship", "lane-sponsor", "gift"].includes(input.registrationType)) {
    errors.registrationType = "Choose a registration type.";
  }

  if (requiresSession && !session) {
    errors.sessionId = "Choose a bowling session.";
  }

  if (requiresSession && session && remainingLanes(session.id) <= 0) {
    errors.sessionId = "This session is full. Choose another session or join the waitlist.";
  }

  if (input.registrationType === "sponsorship" && !getSponsorshipById(input.packageId)) {
    errors.packageId = "Choose a sponsorship level.";
  }

  if (input.registrationType === "lane-sponsor" && input.packageId !== "lane-sponsor") {
    errors.packageId = "Choose the lane sponsor option.";
  }

  if (input.optionalGift < 0) {
    errors.optionalGift = "Additional gift cannot be negative.";
  }

  if (!["card", "invoice", "check"].includes(input.paymentPreference)) {
    errors.paymentPreference = "Choose a payment preference.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const subtotal = selectedPrice(input);
  const donationTotal = Math.max(0, Number(input.optionalGift) || 0);
  const laneCount = requiresSession ? 1 : 0;

  return {
    ok: true,
    record: {
      ...input,
      id,
      createdAt: new Date().toISOString(),
      packageName: selectedName(input),
      sessionName: session?.name ?? "",
      laneCount,
      subtotal,
      donationTotal,
      grandTotal: subtotal + donationTotal,
      paymentStatus: getPaymentStatus(input.paymentPreference),
      exportStatus: "not_exported",
      bowlers: input.registrationType === "team" || input.registrationType === "sponsorship"
        ? buildBowlerList(input.bowlers)
        : [],
    },
  };
};
