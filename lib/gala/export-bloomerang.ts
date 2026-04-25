import { eventConfig } from "./config";
import { toCsv } from "./export-greater-giving";
import type { ExportRow, GalaRegistrationRecord } from "./types";

const bloomerangFields = [
  "First Name",
  "Last Name",
  "Organization Name",
  "Home Email",
  "Mobile Phone Number",
  "Home Address",
  "Home City",
  "Home State",
  "Home ZIP Code",
  "Date",
  "Amount",
  "Fund",
  "Campaign",
  "Appeal",
  "Transaction Method",
  "Non-deductible",
  "Note",
  "Registration Type",
  "Ticket Quantity",
  "Groups",
];

const splitCityStateZip = (value: string) => {
  const [city = "", stateZip = ""] = value.split(",").map((part) => part.trim());
  const [state = "", zip = ""] = stateZip.split(/\s+/, 2);

  return { city, state, zip };
};

const methodLabel = (registration: GalaRegistrationRecord) => {
  if (registration.paymentPreference === "invoice") {
    return "Invoice";
  }

  if (registration.paymentPreference === "check") {
    return "Check";
  }

  return "Credit Card";
};

const baseRow = (registration: GalaRegistrationRecord): ExportRow => {
  const location = splitCityStateZip(registration.cityStateZipCode);

  return {
    "First Name": registration.buyerFirstName,
    "Last Name": registration.buyerLastName,
    "Organization Name": registration.organization,
    "Home Email": registration.buyerEmail,
    "Mobile Phone Number": registration.buyerPhone,
    "Home Address": registration.address,
    "Home City": location.city,
    "Home State": location.state,
    "Home ZIP Code": location.zip,
    Date: registration.createdAt.slice(0, 10),
    Fund: eventConfig.fund,
    Campaign: eventConfig.campaign,
    Appeal: eventConfig.appeal,
    "Transaction Method": methodLabel(registration),
    "Registration Type": registration.packageName,
    "Ticket Quantity": registration.seats,
    Groups: registration.groupName,
  };
};

export const buildBloomerangRows = (
  registrations: GalaRegistrationRecord[],
): ExportRow[] =>
  registrations.flatMap((registration) => {
    const rows: ExportRow[] = [];

    if (registration.subtotal > 0) {
      rows.push({
        ...baseRow(registration),
        Amount: registration.subtotal,
        "Non-deductible": 0,
        Note: `Gala registration purchase. Package ${registration.greaterGivingPackageNumber}. Confirm fair-market/non-deductible value before final import.`,
      });
    }

    if (registration.chanceTotal > 0) {
      rows.push({
        ...baseRow(registration),
        Amount: registration.chanceTotal,
        "Non-deductible": registration.chanceTotal,
        Note: "Chance-to-win entries. Official rules and tax language require confirmation before final use.",
      });
    }

    if (registration.donationTotal > 0) {
      rows.push({
        ...baseRow(registration),
        Amount: registration.donationTotal,
        "Non-deductible": 0,
        Note: "Additional Gala gift.",
      });
    }

    return rows;
  });

export const buildBloomerangTransactionsCsv = (
  registrations: GalaRegistrationRecord[],
) => toCsv(buildBloomerangRows(registrations), bloomerangFields);

export const bloomerangExports = {
  fields: bloomerangFields,
  transactionsCsv: buildBloomerangTransactionsCsv,
};
