import type { BowlingRegistrationRecord } from "./types";

export const committedBowlingPaymentStatuses = [
  "paid",
  "invoice_requested",
  "check_pledged",
] as const;

export const isCommittedBowlingRegistration = (
  registration: BowlingRegistrationRecord,
) => committedBowlingPaymentStatuses.includes(
  registration.paymentStatus as (typeof committedBowlingPaymentStatuses)[number],
);

export const isPendingCardCheckout = (registration: BowlingRegistrationRecord) =>
  registration.paymentPreference === "card" && registration.paymentStatus === "pending";

export const committedBowlingRegistrations = (
  registrations: BowlingRegistrationRecord[],
) => registrations.filter(isCommittedBowlingRegistration);

export const giftOnlyRegistrations = (
  registrations: BowlingRegistrationRecord[],
) => registrations.filter((registration) => registration.registrationType === "gift");

export const eventParticipationRegistrations = (
  registrations: BowlingRegistrationRecord[],
) => registrations.filter((registration) => registration.registrationType !== "gift");
