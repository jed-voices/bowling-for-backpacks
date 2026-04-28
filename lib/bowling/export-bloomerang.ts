import { bowlingEventConfig } from "./config";
import type { BowlingExportRow, BowlingRegistrationRecord } from "./types";

const bloomerangFields = [
  "First Name",
  "Last Name",
  "Organization Name",
  "Home Email",
  "Mobile Phone Number",
  "Date",
  "Amount",
  "Fund",
  "Campaign",
  "Appeal",
  "Transaction Method",
  "Non-deductible",
  "Note",
  "Registration Type",
  "Groups",
];

const csvValue = (value: string | number) => {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
};

export const toCsv = (rows: BowlingExportRow[], fields: string[]) => {
  const header = fields.map(csvValue).join(",");
  const body = rows.map((row) => fields.map((field) => csvValue(row[field] ?? "")).join(","));
  return [header, ...body].join("\n");
};

const methodLabel = (registration: BowlingRegistrationRecord) => {
  if (registration.paymentPreference === "invoice") {
    return "Invoice";
  }

  if (registration.paymentPreference === "check") {
    return "Check";
  }

  return "Credit Card";
};

const baseRow = (registration: BowlingRegistrationRecord): BowlingExportRow => ({
  "First Name": registration.buyerFirstName,
  "Last Name": registration.buyerLastName,
  "Organization Name": registration.organization,
  "Home Email": registration.buyerEmail,
  "Mobile Phone Number": registration.buyerPhone,
  Date: registration.createdAt.slice(0, 10),
  Fund: bowlingEventConfig.fund,
  Campaign: bowlingEventConfig.campaign,
  Appeal: bowlingEventConfig.appeal,
  "Transaction Method": methodLabel(registration),
  "Registration Type": registration.packageName,
  Groups: bowlingEventConfig.groups,
});

export const buildBowlingBloomerangRows = (
  registrations: BowlingRegistrationRecord[],
): BowlingExportRow[] =>
  registrations.flatMap((registration) => {
    const rows: BowlingExportRow[] = [];

    if (registration.subtotal > 0) {
      rows.push({
        ...baseRow(registration),
        Amount: registration.subtotal,
        "Non-deductible": 0,
        Note: `${registration.packageName}. Session: ${registration.sessionName || "none"}. Team: ${registration.teamName || "none"}. Confirm non-deductible values before import.`,
      });
    }

    if (registration.donationTotal > 0) {
      rows.push({
        ...baseRow(registration),
        Amount: registration.donationTotal,
        "Non-deductible": 0,
        Note: `Additional ${bowlingEventConfig.name} gift.`,
      });
    }

    return rows;
  });

export const buildBowlingOperationsRows = (
  registrations: BowlingRegistrationRecord[],
): BowlingExportRow[] =>
  registrations.map((registration) => ({
    RegistrationId: registration.id,
    Type: registration.registrationType,
    Package: registration.packageName,
    BuyerName: `${registration.buyerFirstName} ${registration.buyerLastName}`.trim(),
    BuyerEmail: registration.buyerEmail,
    BuyerPhone: registration.buyerPhone,
    Organization: registration.organization,
    TeamName: registration.teamName,
    Session: registration.sessionName,
    LaneCount: registration.laneCount,
    BowlerCount: registration.bowlers.filter((bowler) => bowler.firstName || bowler.lastName).length,
    SponsorLogo: registration.sponsorLogoName ? "received" : "missing",
    Subtotal: registration.subtotal,
    Gift: registration.donationTotal,
    Total: registration.grandTotal,
    PaymentPreference: registration.paymentPreference,
    PaymentStatus: registration.paymentStatus,
    ExportStatus: registration.exportStatus,
    Notes: registration.notes,
  }));

export const bowlingExports = {
  bloomerangFields,
  operationsFields: [
    "RegistrationId",
    "Type",
    "Package",
    "BuyerName",
    "BuyerEmail",
    "BuyerPhone",
    "Organization",
    "TeamName",
    "Session",
    "LaneCount",
    "BowlerCount",
    "SponsorLogo",
    "Subtotal",
    "Gift",
    "Total",
    "PaymentPreference",
    "PaymentStatus",
    "ExportStatus",
    "Notes",
  ],
  bloomerangCsv: (registrations: BowlingRegistrationRecord[]) =>
    toCsv(buildBowlingBloomerangRows(registrations), bloomerangFields),
  operationsCsv: (registrations: BowlingRegistrationRecord[]) =>
    toCsv(buildBowlingOperationsRows(registrations), bowlingExports.operationsFields),
};
