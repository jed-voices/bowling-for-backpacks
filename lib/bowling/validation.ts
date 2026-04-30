import {
  bowlingEventConfig,
  getRegistrationOptionById,
  getSessionById,
  getSponsorshipById,
  isRegisterableBowlingSponsorship,
  teamRegistration,
} from "./config";
import { isCommittedBowlingRegistration } from "./records";
import type {
  Bowler,
  BowlingPaymentStatus,
  BowlingRegistrationInput,
  BowlingRegistrationRecord,
} from "./types";

export type BowlingValidationResult =
  | { ok: true; record: BowlingRegistrationRecord }
  | { ok: false; errors: Record<string, string> };

export const minimumGiftAmount = 5;

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
    .filter(
      (registration) =>
        registration.sessionId === sessionId &&
        needsSession(registration.registrationType) &&
        isCommittedBowlingRegistration(registration),
    )
    .reduce((sum, registration) => sum + Math.max(1, registration.laneCount), 0);

  return Math.max(0, session.laneCapacity - heldLanes);
};

export const needsSession = (registrationType: BowlingRegistrationInput["registrationType"]) =>
  registrationType === "team" || registrationType === "sponsorship";

export const getsTeamManagementLink = (
  registrationType: BowlingRegistrationInput["registrationType"],
) => registrationType === "team";

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
  const supportsTeamManagement = getsTeamManagementLink(input.registrationType);
  const session = input.sessionId ? getSessionById(input.sessionId) : undefined;
  const donationTotal = Math.max(0, Number(input.optionalGift) || 0);
  const selectedSponsorship = getSponsorshipById(input.packageId);
  const requestedLaneCount =
    input.registrationType === "team"
      ? 1
      : input.registrationType === "sponsorship"
        ? selectedSponsorship?.lanes ?? 1
        : 0;

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

  if (requiresSession && session && remainingLanes(session.id) < requestedLaneCount) {
    errors.sessionId =
      requestedLaneCount > 1
        ? `This session does not have ${requestedLaneCount} lanes available. Choose another session or contact City Center.`
        : "This session is full. Choose another session or join the waitlist.";
  }

  if (input.registrationType === "sponsorship" && !selectedSponsorship) {
    errors.packageId = "Choose a sponsorship level.";
  }

  if (
    input.registrationType === "sponsorship" &&
    selectedSponsorship &&
    !isRegisterableBowlingSponsorship(input.packageId)
  ) {
    errors.packageId = "Choose an available sponsorship level.";
  }

  if (input.registrationType === "lane-sponsor" && input.packageId !== "lane-sponsor") {
    errors.packageId = "Choose the lane sponsor option.";
  }

  if (Number(input.optionalGift) < 0) {
    errors.optionalGift = "Additional gift cannot be negative.";
  }

  if (input.registrationType === "gift" && donationTotal < minimumGiftAmount) {
    errors.optionalGift = `Gift amount must be at least ${formatCurrency(minimumGiftAmount)}.`;
  }

  if (input.registrationType !== "gift" && donationTotal > 0 && donationTotal < minimumGiftAmount) {
    errors.optionalGift = `Additional gift must be at least ${formatCurrency(minimumGiftAmount)} or left blank.`;
  }

  if (!["card", "invoice", "check"].includes(input.paymentPreference)) {
    errors.paymentPreference = "Choose a payment preference.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const subtotal = selectedPrice(input);
  const laneCount = requestedLaneCount;
  const normalizedPackageId =
    input.registrationType === "team"
      ? teamRegistration.id
      : input.registrationType === "gift"
        ? "gift"
        : input.registrationType === "lane-sponsor"
          ? "lane-sponsor"
          : input.packageId;

  return {
    ok: true,
    record: {
      ...input,
      id,
      createdAt: new Date().toISOString(),
      packageId: normalizedPackageId,
      packageName: selectedName(input),
      sessionId: requiresSession ? input.sessionId : "",
      sessionName: requiresSession ? session?.name ?? "" : "",
      teamName: supportsTeamManagement ? input.teamName : "",
      sponsorLogoName:
        input.registrationType === "sponsorship" || input.registrationType === "lane-sponsor"
          ? input.sponsorLogoName ?? ""
          : "",
      laneCount,
      subtotal,
      optionalGift: donationTotal,
      donationTotal,
      grandTotal: subtotal + donationTotal,
      paymentStatus: getPaymentStatus(input.paymentPreference),
      exportStatus: "not_exported",
      saveTeamLink: supportsTeamManagement ? input.saveTeamLink : false,
      bowlers: supportsTeamManagement ? buildBowlerList(input.bowlers) : [],
    },
  };
};
