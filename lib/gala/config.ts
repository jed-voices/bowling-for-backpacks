import type { GalaPackage, GalaRegistrationRecord } from "./types";

// Source of truth for 2026 details (verified 2026-09-18):
// Greater Giving registration page + Kimberly Winston's 9/16 and 9/17 supporter emails.
// Registration and payment happen on Greater Giving, not on this site.
export const eventConfig = {
  name: "Stories From the Center",
  organization: "City Center",
  edition: "9th Annual Gala",
  theme: "Welcome to Our Neighborhood",
  date: "Friday, October 30, 2026",
  dateShort: "Oct. 30, 2026",
  isoDate: "2026-10-30",
  season: "Friday, October 30, 2026",
  doorsTime: "5:30 PM",
  venue: "City + State",
  address: "19 NE 6th St, Oklahoma City, OK 73104",
  city: "Oklahoma City",
  attire: "Business casual",
  // Greater Giving registration form. Every Register button goes straight here
  // (Jed, 2026-09-19): no stop on the event page at .../tabid/1601230/ first.
  // The /2026register short link is broken and is not used anywhere.
  registrationUrl:
    "https://okcitycenter.ejoinme.org/MyEvents/2026StoriesFromTheCenter/Registration/tabid/1601231/Default.aspx",
  registrationCloses: "Thursday, October 15, 2026",
  contactEmail: "info@okcitycenter.org",
  contactPhone: "(405) 384-5670",
  checkMailingAddress: "City Center, P.O. Box 42301, Oklahoma City, OK 73123",
  auctionLine: "Dinner / Live Auction / Silent Auction",
  chanceEntryPrice: 100,
  guestListBaseUrl: "/gala/guest-list",
  voicesOfOkcUrl: "https://okcitycenter.org/podcast",
  fund: "City Center",
  campaign: "2026 Gala",
  appeal: "Stories From The Center",
};

export const sponsorships: GalaPackage[] = [
  {
    id: "presenting",
    greaterGivingPackageNumber: "NEW-2026-01",
    name: "Presenting Sponsor",
    price: 25000,
    seats: 16,
    label: "Leadership Gift",
    category: "sponsorship",
    description:
      "A major leadership sponsorship for a partner who wants to help carry the evening and be visibly connected to City Center's work of relief and restoration.",
    benefits: [
      "Two premier tables for 16 guests",
      "Featured recognition from stage",
      "Premier logo placement on event website and screens",
      "Featured social recognition before and after the Gala",
      "Premium placement in printed program",
      "Dedicated City Center thank-you after the event",
    ],
  },
  {
    id: "restoration",
    greaterGivingPackageNumber: "NEW-2026-02",
    name: "Restoration Sponsor",
    price: 10000,
    seats: 10,
    label: "High-Impact Table",
    category: "sponsorship",
    description:
      "A strong sponsorship level for companies, families, or foundations ready to make the Gala a larger annual investment in steady relationships and practical care.",
    benefits: [
      "One premier table for 10 guests",
      "Logo placement on event website and event screens",
      "Recognition in printed program",
      "Social recognition before the event",
      "Priority seating",
    ],
  },
  {
    id: "openhanded",
    greaterGivingPackageNumber: "1",
    name: "Openhanded Legacy",
    price: 5000,
    seats: 10,
    label: "Generous Table",
    category: "sponsorship",
    description:
      "A generous table sponsorship for partners who want to gather people close to the mission and support a meaningful portion of the evening.",
    benefits: [
      "Reserved table for 10 guests",
      "Dinner and two drink tickets for each guest",
      "Logo on event program, website, and social media",
      "Logo recognition at event",
      "Special acknowledgment and table recognition",
    ],
  },
  {
    id: "legacy-table",
    greaterGivingPackageNumber: "2",
    name: "Legacy Table Sponsor",
    price: 2500,
    seats: 8,
    label: "Core Table",
    category: "sponsorship",
    description:
      "A core table sponsorship for companies, churches, families, and friends who want to host guests around City Center's mission.",
    benefits: [
      "Reserved table for 8 guests",
      "Dinner and two drink tickets for each guest",
      "Logo on event program, website, and social media",
      "Logo recognition at event",
      "Name recognition on table",
    ],
  },
  {
    id: "compassion",
    greaterGivingPackageNumber: "3",
    name: "Compassion Legacy",
    price: 2000,
    seats: 4,
    label: "Small Group",
    category: "sponsorship",
    description:
      "A smaller sponsorship level that still offers meaningful recognition and a strong place in the evening.",
    benefits: [
      "Reserved seating for 4 guests",
      "Dinner and two drink tickets for each guest",
      "Logo on event program, website, and social media",
      "Logo recognition at event",
      "Name recognition at table",
    ],
  },
];

export const ticketOptions: GalaPackage[] = [
  {
    id: "individual",
    greaterGivingPackageNumber: "2001",
    name: "Individual Ticket Open Seating",
    price: 250,
    seats: 1,
    category: "ticket",
    description:
      "One open-seating ticket including dinner and two drink tickets. Seating requests may be submitted, but seats together are not guaranteed.",
  },
  {
    id: "couple",
    greaterGivingPackageNumber: "2001",
    name: "Two Individual Tickets",
    price: 500,
    seats: 2,
    category: "ticket",
    description: "Two open-seating tickets for guests attending together.",
  },
  {
    id: "transformation-four",
    greaterGivingPackageNumber: "350000",
    name: "Transformation Legacy (4)",
    price: 1000,
    seats: 4,
    category: "ticket",
    description:
      "Four seats for a small group, family, or friend circle attending together.",
  },
];

export const galaPackages = [...sponsorships, ...ticketOptions];

// What the public page shows. Matches the options open on Greater Giving
// as of 2026-09-18. Add levels here only after they exist on Greater Giving.
export type PublicGalaOption = {
  id: string;
  name: string;
  price: number;
  seats: number;
  label: string;
  description: string;
  benefits: string[];
};

export const publicGalaOptions: PublicGalaOption[] = [
  {
    id: "legacy-table",
    name: "Legacy Table Sponsor",
    price: 2500,
    seats: 8,
    label: "Host a Table",
    description:
      "Gather eight people you care about (clients, family, church, or team) around City Center's work for one evening.",
    benefits: [
      "Reserved table for 8 guests",
      "Dinner for every guest",
      "Your name recognized at the table",
    ],
  },
  {
    id: "individual",
    name: "Individual Ticket",
    price: 250,
    seats: 1,
    label: "Open Seating",
    description:
      "One seat for the evening, including dinner. Seating is open, so let us know if you hope to sit with friends.",
    benefits: ["One open-seating ticket", "Dinner and the full evening program"],
  },
];

export const getPackageById = (id: string) =>
  galaPackages.find((item) => item.id === id);

export const paymentPreferenceLabels = {
  card: "Pay online by card",
  invoice: "Request invoice",
  check: "Pay later by check",
} as const;

export const paymentCtaLabels = {
  card: "Continue to Secure Checkout",
  invoice: "Submit Invoice Request",
  check: "Save Check Pledge",
} as const;

export const mealChoices = [
  "Standard dinner",
  "Vegetarian",
  "Gluten-free",
  "No meal needed",
];

export const sampleRegistrations: GalaRegistrationRecord[] = [
  {
    id: "preview-1001",
    accessToken: "sample-gala-access-token-1001",
    createdAt: "2026-04-24T15:00:00.000Z",
    buyerFirstName: "Avery",
    buyerLastName: "Patterson",
    buyerEmail: "avery@example.com",
    buyerPhone: "405-555-0198",
    organization: "Patterson Family Foundation",
    address: "100 Main Street",
    cityStateZipCode: "Oklahoma City, OK 73102",
    affiliate: "Board",
    groupName: "Patterson Guests",
    tableRequest: "Seat with City Center board guests",
    admitInfo: "Host will submit guest names by August 1.",
    packageId: "restoration",
    packageName: "Restoration Sponsor",
    greaterGivingPackageNumber: "NEW-2026-02",
    category: "sponsorship",
    quantity: 1,
    seats: 10,
    guests: [],
    notes: "Preview data only.",
    optionalGift: 2500,
    chanceEntryQuantity: 10,
    sendGuestListLink: true,
    subtotal: 10000,
    chanceTotal: 1000,
    donationTotal: 2500,
    grandTotal: 13500,
    paymentPreference: "invoice",
    paymentStatus: "invoice_requested",
    exportStatus: "not_exported",
  },
  {
    id: "preview-1002",
    accessToken: "sample-gala-access-token-1002",
    createdAt: "2026-04-24T16:00:00.000Z",
    buyerFirstName: "Jordan",
    buyerLastName: "Mills",
    buyerEmail: "jordan@example.com",
    buyerPhone: "405-555-0172",
    organization: "Mills Creative",
    address: "240 Film Row",
    cityStateZipCode: "Oklahoma City, OK 73106",
    affiliate: "Community partner",
    groupName: "Mills Table",
    tableRequest: "Near stage if available",
    admitInfo: "",
    packageId: "legacy-table",
    packageName: "Legacy Table Sponsor",
    greaterGivingPackageNumber: "2",
    category: "sponsorship",
    quantity: 1,
    seats: 8,
    guests: [],
    notes: "Preview data only.",
    optionalGift: 0,
    chanceEntryQuantity: 4,
    sendGuestListLink: true,
    subtotal: 2500,
    chanceTotal: 400,
    donationTotal: 0,
    grandTotal: 2900,
    paymentPreference: "card",
    paymentStatus: "pending",
    exportStatus: "needs_review",
  },
];
