export type BowlingRegistrationType = "team" | "sponsorship" | "lane-sponsor" | "gift";
export type BowlingPaymentPreference = "card" | "invoice" | "check";
export type BowlingPaymentStatus = "pending" | "paid" | "invoice_requested" | "check_pledged";
export type BowlingExportStatus = "not_exported" | "exported" | "needs_review";
export type BowlingSponsorshipStatus = "available" | "sponsored";

export type BowlingSession = {
  id: string;
  name: string;
  time: string;
  description: string;
  laneCapacity: number;
  registeredTeams: number;
  waitlistCount: number;
};

export type BowlingSponsorship = {
  id: string;
  name: string;
  price: number;
  lanes: number;
  status: BowlingSponsorshipStatus;
  description: string;
  benefits: string[];
  recognition: string[];
  impactMessage?: string;
  sponsorName?: string;
  notificationRequired?: boolean;
  notificationSent?: boolean;
  publicDisplay?: boolean;
  includesTeam?: boolean;
  featured?: boolean;
};

export type BowlingOption = {
  id: BowlingRegistrationType;
  name: string;
  price: number;
  description: string;
  includes: string[];
};

export type Bowler = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
};

export type BowlingRegistrationInput = {
  registrationType: BowlingRegistrationType;
  packageId: string;
  buyerFirstName: string;
  buyerLastName: string;
  buyerEmail: string;
  buyerPhone: string;
  organization: string;
  teamName: string;
  sessionId: string;
  bowlers: Bowler[];
  sponsorLogoName?: string;
  optionalGift: number;
  notes: string;
  paymentPreference: BowlingPaymentPreference;
  saveTeamLink: boolean;
};

export type BowlingRegistrationRecord = BowlingRegistrationInput & {
  id: string;
  createdAt: string;
  packageName: string;
  sessionName: string;
  laneCount: number;
  subtotal: number;
  donationTotal: number;
  grandTotal: number;
  paymentStatus: BowlingPaymentStatus;
  exportStatus: BowlingExportStatus;
};

export type BowlingExportRow = Record<string, string | number>;
