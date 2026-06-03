import { eventConfig, getPackageById } from "./config";
import type {
  GalaGuest,
  GalaPackage,
  GalaRegistrationInput,
  GalaRegistrationRecord,
  PaymentStatus,
} from "./types";

export type ValidationResult =
  | { ok: true; record: GalaRegistrationRecord }
  | { ok: false; errors: Record<string, string> };

export type GalaInputParseResult =
  | { ok: true; input: GalaRegistrationInput }
  | { ok: false; errors: Record<string, string> };

export const blankGuest = (): GalaGuest => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  mealChoice: "Standard dinner",
  dietaryNotes: "",
  tableRequest: "",
  admissionIncluded: 1,
});

export const buildGuestList = (seats: number, existing: GalaGuest[] = []) => {
  const safeSeats = Math.max(1, seats);
  return Array.from({ length: safeSeats }, (_, index) => existing[index] ?? blankGuest());
};

export const calculateSeats = (selectedPackage: GalaPackage, quantity: number) => {
  if (selectedPackage.category === "sponsorship") {
    return selectedPackage.seats;
  }

  return selectedPackage.seats * Math.max(1, quantity);
};

export const calculateTotals = (
  selectedPackage: GalaPackage,
  quantity: number,
  optionalGift: number,
  chanceEntryQuantity: number,
) => {
  const packageQuantity = selectedPackage.category === "sponsorship" ? 1 : Math.max(1, quantity);
  const subtotal = selectedPackage.price * packageQuantity;
  const chanceTotal = Math.max(0, chanceEntryQuantity) * eventConfig.chanceEntryPrice;
  const donationTotal = Math.max(0, optionalGift);

  return {
    subtotal,
    chanceTotal,
    donationTotal,
    grandTotal: subtotal + chanceTotal + donationTotal,
  };
};

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));

const stringField = (
  payload: Record<string, unknown>,
  key: keyof GalaRegistrationInput,
  errors: Record<string, string>,
) => {
  const value = payload[key];

  if (typeof value === "string") {
    return value;
  }

  errors[key] = "Expected text.";
  return "";
};

const numberField = (
  payload: Record<string, unknown>,
  key: keyof GalaRegistrationInput,
  errors: Record<string, string>,
) => {
  const value = payload[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }

  errors[key] = "Expected a number.";
  return 0;
};

const booleanField = (
  payload: Record<string, unknown>,
  key: keyof GalaRegistrationInput,
  errors: Record<string, string>,
) => {
  const value = payload[key];

  if (typeof value === "boolean") {
    return value;
  }

  errors[key] = "Expected true or false.";
  return false;
};

const parseGuest = (value: unknown): GalaGuest => {
  const payload = isRecord(value) ? value : {};

  return {
    firstName: typeof payload.firstName === "string" ? payload.firstName : "",
    lastName: typeof payload.lastName === "string" ? payload.lastName : "",
    email: typeof payload.email === "string" ? payload.email : "",
    phone: typeof payload.phone === "string" ? payload.phone : "",
    mealChoice: typeof payload.mealChoice === "string" ? payload.mealChoice : "Standard dinner",
    dietaryNotes: typeof payload.dietaryNotes === "string" ? payload.dietaryNotes : "",
    tableRequest: typeof payload.tableRequest === "string" ? payload.tableRequest : "",
    admissionIncluded:
      typeof payload.admissionIncluded === "number" && Number.isFinite(payload.admissionIncluded)
        ? payload.admissionIncluded
        : 1,
  };
};

export const parseGalaRegistrationInput = (payload: unknown): GalaInputParseResult => {
  if (!isRecord(payload)) {
    return { ok: false, errors: { form: "Registration payload must be an object." } };
  }

  const errors: Record<string, string> = {};
  const guestsValue = payload.guests;
  const guests = Array.isArray(guestsValue) ? guestsValue.map(parseGuest) : [];

  if (guestsValue !== undefined && !Array.isArray(guestsValue)) {
    errors.guests = "Expected a list of guests.";
  }

  const input: GalaRegistrationInput = {
    buyerFirstName: stringField(payload, "buyerFirstName", errors),
    buyerLastName: stringField(payload, "buyerLastName", errors),
    buyerEmail: stringField(payload, "buyerEmail", errors),
    buyerPhone: stringField(payload, "buyerPhone", errors),
    organization: stringField(payload, "organization", errors),
    address: stringField(payload, "address", errors),
    cityStateZipCode: stringField(payload, "cityStateZipCode", errors),
    affiliate: stringField(payload, "affiliate", errors),
    groupName: stringField(payload, "groupName", errors),
    tableRequest: stringField(payload, "tableRequest", errors),
    admitInfo: stringField(payload, "admitInfo", errors),
    packageId: stringField(payload, "packageId", errors),
    quantity: numberField(payload, "quantity", errors),
    guests,
    sponsorLogoName:
      typeof payload.sponsorLogoName === "string" ? payload.sponsorLogoName : "",
    notes: stringField(payload, "notes", errors),
    optionalGift: numberField(payload, "optionalGift", errors),
    chanceEntryQuantity: numberField(payload, "chanceEntryQuantity", errors),
    paymentPreference: stringField(payload, "paymentPreference", errors) as GalaRegistrationInput["paymentPreference"],
    sendGuestListLink: booleanField(payload, "sendGuestListLink", errors),
  };

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, input };
};

export const getPaymentStatus = (
  paymentPreference: GalaRegistrationInput["paymentPreference"],
): PaymentStatus => {
  if (paymentPreference === "invoice") {
    return "invoice_requested";
  }

  if (paymentPreference === "check") {
    return "check_pledged";
  }

  return "pending";
};

export const validateRegistrationInput = (
  input: GalaRegistrationInput,
  id = `preview-${crypto.randomUUID()}`,
): ValidationResult => {
  const errors: Record<string, string> = {};
  const selectedPackage = getPackageById(input.packageId);

  if (!input.buyerFirstName.trim()) {
    errors.buyerFirstName = "First name is required.";
  }

  if (!input.buyerLastName.trim()) {
    errors.buyerLastName = "Last name is required.";
  }

  if (!emailPattern.test(input.buyerEmail.trim())) {
    errors.buyerEmail = "A valid email is required.";
  }

  if (!selectedPackage) {
    errors.packageId = "Choose a sponsorship or ticket option.";
  }

  if (!["card", "invoice", "check"].includes(input.paymentPreference)) {
    errors.paymentPreference = "Choose a payment preference.";
  }

  if (input.quantity < 1) {
    errors.quantity = "Quantity must be at least 1.";
  }

  if (input.optionalGift < 0) {
    errors.optionalGift = "Additional gift cannot be negative.";
  }

  if (input.chanceEntryQuantity < 0) {
    errors.chanceEntryQuantity = "Chance-to-win entries cannot be negative.";
  }

  if (!selectedPackage || Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const safeQuantity = selectedPackage.category === "sponsorship" ? 1 : Math.max(1, input.quantity);
  const seats = calculateSeats(selectedPackage, safeQuantity);
  const totals = calculateTotals(
    selectedPackage,
    safeQuantity,
    Number(input.optionalGift) || 0,
    Number(input.chanceEntryQuantity) || 0,
  );

  return {
    ok: true,
    record: {
      ...input,
      id,
      accessToken: "",
      createdAt: new Date().toISOString(),
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      greaterGivingPackageNumber: selectedPackage.greaterGivingPackageNumber,
      category: selectedPackage.category,
      quantity: safeQuantity,
      seats,
      guests: buildGuestList(seats, input.guests),
      subtotal: totals.subtotal,
      chanceTotal: totals.chanceTotal,
      donationTotal: totals.donationTotal,
      grandTotal: totals.grandTotal,
      paymentStatus: getPaymentStatus(input.paymentPreference),
      exportStatus: "not_exported",
    },
  };
};
