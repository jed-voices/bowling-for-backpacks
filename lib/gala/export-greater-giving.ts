import type { ExportRow, GalaGuest, GalaRegistrationRecord } from "./types";

const supporterFields = [
  "BidderNumber",
  "BidderName",
  "FirstName",
  "LastName",
  "Company",
  "Email",
  "Phone1",
  "Phone2",
  "Address",
  "CityStateZipCode",
  "MealChoice",
  "Affiliate",
  "Group",
  "Table",
  "Admission",
  "AdmitPaid",
  "AdmitPrice",
  "AdmitValue",
  "AdmissionsPurchased",
  "AdmissionsUsed",
  "PaymentType",
  "AdmitInfo",
  "Notes",
  "PackageNumber",
  "PackageName",
];

const salesFields = [
  "PackageNumber",
  "PackageName",
  "PackageType",
  "Quantity",
  "Admissions",
  "BuyerName",
  "BuyerEmail",
  "BuyerPhone",
  "Organization",
  "SaleAmount",
  "ChanceEntries",
  "ChanceAmount",
  "AdditionalDonation",
  "PaymentPreference",
  "PaymentStatus",
  "SyncStatus",
];

const chanceFields = [
  "EntryNumber",
  "BuyerName",
  "BuyerEmail",
  "Amount",
  "PaymentStatus",
  "DrawingStatus",
  "RegistrationId",
];

const csvValue = (value: string | number) => {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
};

export const toCsv = (rows: ExportRow[], fields: string[]) => {
  const header = fields.map(csvValue).join(",");
  const body = rows.map((row) => fields.map((field) => csvValue(row[field] ?? "")).join(","));
  return [header, ...body].join("\n");
};

const buyerName = (registration: GalaRegistrationRecord) =>
  `${registration.buyerFirstName} ${registration.buyerLastName}`.trim();

const guestName = (guest: GalaGuest) =>
  `${guest.firstName} ${guest.lastName}`.trim();

const paymentType = (registration: GalaRegistrationRecord) => {
  if (registration.paymentPreference === "invoice") {
    return "Invoice";
  }

  if (registration.paymentPreference === "check") {
    return "Check pledge";
  }

  return "Card";
};

export const buildGreaterGivingSupporterRows = (
  registrations: GalaRegistrationRecord[],
): ExportRow[] =>
  registrations.flatMap((registration) => {
    const base = {
      Company: registration.organization,
      Phone2: "",
      Address: registration.address,
      CityStateZipCode: registration.cityStateZipCode,
      Affiliate: registration.affiliate,
      Group: registration.groupName,
      Table: registration.tableRequest,
      Admission: registration.packageName,
      AdmitPaid: registration.paymentStatus === "paid" ? "Yes" : "No",
      AdmitPrice: registration.subtotal,
      AdmitValue: "",
      AdmissionsPurchased: registration.seats,
      PaymentType: paymentType(registration),
      AdmitInfo: registration.admitInfo,
      Notes: registration.notes,
      PackageNumber: registration.greaterGivingPackageNumber,
      PackageName: registration.packageName,
    };

    const buyerRow: ExportRow = {
      ...base,
      BidderNumber: "",
      BidderName: buyerName(registration),
      FirstName: registration.buyerFirstName,
      LastName: registration.buyerLastName,
      Email: registration.buyerEmail,
      Phone1: registration.buyerPhone,
      MealChoice: "",
      AdmissionsUsed: registration.guests.filter((guest) => guest.firstName || guest.lastName).length,
    };

    const guestRows = registration.guests
      .filter((guest) => guest.firstName || guest.lastName || guest.email)
      .map((guest): ExportRow => ({
        ...base,
        BidderNumber: "",
        BidderName: guestName(guest),
        FirstName: guest.firstName,
        LastName: guest.lastName,
        Email: guest.email,
        Phone1: guest.phone,
        MealChoice: guest.mealChoice,
        Table: guest.tableRequest || registration.tableRequest,
        AdmissionsUsed: guest.admissionIncluded,
      }));

    return [buyerRow, ...guestRows];
  });

export const buildGreaterGivingSalesRows = (
  registrations: GalaRegistrationRecord[],
): ExportRow[] =>
  registrations.map((registration) => ({
    PackageNumber: registration.greaterGivingPackageNumber,
    PackageName: registration.packageName,
    PackageType: registration.category,
    Quantity: registration.quantity,
    Admissions: registration.seats,
    BuyerName: buyerName(registration),
    BuyerEmail: registration.buyerEmail,
    BuyerPhone: registration.buyerPhone,
    Organization: registration.organization,
    SaleAmount: registration.subtotal,
    ChanceEntries: registration.chanceEntryQuantity,
    ChanceAmount: registration.chanceTotal,
    AdditionalDonation: registration.donationTotal,
    PaymentPreference: registration.paymentPreference,
    PaymentStatus: registration.paymentStatus,
    SyncStatus: registration.exportStatus,
  }));

export const buildChanceToWinRows = (
  registrations: GalaRegistrationRecord[],
): ExportRow[] =>
  registrations.flatMap((registration) =>
    Array.from({ length: registration.chanceEntryQuantity }, (_, index) => ({
      EntryNumber: `${registration.id}-${String(index + 1).padStart(3, "0")}`,
      BuyerName: buyerName(registration),
      BuyerEmail: registration.buyerEmail,
      Amount: 100,
      PaymentStatus: registration.paymentStatus,
      DrawingStatus: registration.paymentStatus === "paid" ? "eligible" : "eligible_after_payment",
      RegistrationId: registration.id,
    })),
  );

export const buildBackendPayload = (registrations: GalaRegistrationRecord[]) => ({
  generatedAt: new Date().toISOString(),
  source: "stories-from-the-center-static-prototype",
  registrations,
});

export const greaterGivingExports = {
  supporterFields,
  salesFields,
  chanceFields,
  supportersCsv: (registrations: GalaRegistrationRecord[]) =>
    toCsv(buildGreaterGivingSupporterRows(registrations), supporterFields),
  salesCsv: (registrations: GalaRegistrationRecord[]) =>
    toCsv(buildGreaterGivingSalesRows(registrations), salesFields),
  chanceCsv: (registrations: GalaRegistrationRecord[]) =>
    toCsv(buildChanceToWinRows(registrations), chanceFields),
};
