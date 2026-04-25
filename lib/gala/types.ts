export type PaymentPreference = "card" | "invoice" | "check";
export type PaymentStatus = "pending" | "paid" | "invoice_requested" | "check_pledged";
export type ExportStatus = "not_exported" | "exported" | "needs_review";
export type PackageCategory = "sponsorship" | "ticket";

export type GalaPackage = {
  id: string;
  greaterGivingPackageNumber: string;
  name: string;
  price: number;
  seats: number;
  label?: string;
  description: string;
  benefits?: string[];
  category: PackageCategory;
};

export type GalaGuest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mealChoice: string;
  dietaryNotes: string;
  tableRequest: string;
  admissionIncluded: number;
};

export type GalaRegistrationInput = {
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string;
  organization: string;
  address: string;
  cityStateZipCode: string;
  affiliate: string;
  groupName: string;
  tableRequest: string;
  admitInfo: string;
  packageId: string;
  quantity: number;
  guests: GalaGuest[];
  sponsorLogoName?: string;
  notes: string;
  optionalGift: number;
  chanceEntryQuantity: number;
  paymentPreference: PaymentPreference;
  sendGuestListLink: boolean;
};

export type GalaRegistrationRecord = GalaRegistrationInput & {
  id: string;
  createdAt: string;
  packageName: string;
  greaterGivingPackageNumber: string;
  category: PackageCategory;
  seats: number;
  subtotal: number;
  chanceTotal: number;
  donationTotal: number;
  grandTotal: number;
  paymentStatus: PaymentStatus;
  exportStatus: ExportStatus;
};

export type ExportRow = Record<string, string | number>;
