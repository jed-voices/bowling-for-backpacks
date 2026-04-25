import type {
  BowlingOption,
  BowlingRegistrationRecord,
  BowlingSession,
  BowlingSponsorship,
} from "./types";

export const bowlingEventConfig = {
  name: "Bowling for Backpacks",
  subtitle: "A City Center Christmas in July Back-to-School Fundraiser",
  theme: "Christmas in July",
  date: "July 16, 2026",
  venue: "Andy B's",
  city: "Oklahoma City",
  cause: "Backpacks, school supplies, and back-to-school support for students and families",
  teamPrice: 750,
  lanesPerSession: 21,
  teamSize: 6,
  teamBaseUrl: "/bowling-for-backpacks/team",
  contactName: "Kimberly Winston",
  contactTitle: "Development Director",
  contactEmail: "kimberly@okcitycenter.org",
  fund: "City Center",
  campaign: "2026 Bowling for Backpacks",
  appeal: "Back-to-School Bash",
  groups: "Bowling for Backpacks | Back-to-School",
};

export const bowlingSessions: BowlingSession[] = [
  {
    id: "corporate-session",
    name: "Corporate Team Session",
    time: "2:00-4:00 PM",
    description:
      "Start the day with a high-energy session designed for corporate teams to connect, compete, and make a difference. It's a meaningful way to build team unity while investing in youth and families across OKC.",
    laneCapacity: 21,
    registeredTeams: 12,
    waitlistCount: 0,
  },
  {
    id: "family-night",
    name: "Community & Family Session",
    time: "5:30-7:30 PM",
    description:
      "Bring your family, invite your friends, and join us for an evening of fun and impact. This session is a chance for the broader community to come together in support of local students and families.",
    laneCapacity: 21,
    registeredTeams: 16,
    waitlistCount: 0,
  },
];

export const bowlingTimeline = [
  {
    time: "2:00-4:00 PM",
    title: "Corporate Team Session",
    description:
      "Start the day with a high-energy session designed for corporate teams to connect, compete, and make a difference. It's a meaningful way to build team unity while investing in youth and families across OKC.",
  },
  {
    time: "4:15-5:15 PM",
    title: "Business Networking",
    description:
      "Connect with business leaders, partners, and community-minded professionals who care deeply about the future of our city. This dedicated hour creates space to build relationships and rally around a shared purpose.",
  },
  {
    time: "5:30-7:30 PM",
    title: "Community & Family Session",
    description:
      "Bring your family, invite your friends, and join us for an evening of fun and impact. This session is a chance for the broader community to come together in support of local students and families.",
  },
];

export const bowlingSponsorships: BowlingSponsorship[] = [
  {
    id: "presenting",
    name: "Presenting Sponsor",
    price: 10000,
    description:
      "A leadership sponsorship that helps carry the Christmas-in-July event and provide meaningful back-to-school support for students and families.",
    benefits: [
      "Premier recognition on event website",
      "Featured recognition at the event",
      "Logo placement on event materials",
      "Social media recognition",
      "Team registration included",
    ],
    includesTeam: true,
  },
  {
    id: "corporate-session",
    name: "Corporate Team Session Sponsor",
    price: 5000,
    description:
      "Sponsor the corporate bowling session and gather teams around a fun, purpose-filled Christmas-in-July event.",
    benefits: [
      "Recognition connected to the Corporate Team Session",
      "Logo on event website",
      "Event signage recognition",
      "Social media recognition",
      "Team registration included",
    ],
    includesTeam: true,
  },
  {
    id: "family-night",
    name: "Community & Family Session Sponsor",
    price: 5000,
    description:
      "Sponsor the community and family evening session and help create a joyful summer-holiday night of generosity.",
    benefits: [
      "Recognition connected to the Community & Family Session",
      "Logo on event website",
      "Event signage recognition",
      "Social media recognition",
      "Team registration included",
    ],
    includesTeam: true,
  },
  {
    id: "lane-sponsor",
    name: "Lane Sponsor",
    price: 500,
    description:
      "Sponsor a lane and help turn Christmas in July into practical support for students starting the school year.",
    benefits: [
      "Name or logo recognition on one lane",
      "Recognition on event website",
      "Great option for families, small businesses, and community partners",
    ],
  },
  {
    id: "friend",
    name: "Friend of City Center",
    price: 1000,
    description:
      "A meaningful Christmas-in-July gift for supporters who want to help students and families without registering a full sponsorship.",
    benefits: [
      "Recognition as a Friend of City Center",
      "Event website recognition",
      "Supports back-to-school supplies and family outreach",
    ],
  },
];

export const teamRegistration: BowlingOption = {
  id: "team",
  name: "Team Registration",
  price: 750,
  description:
    "Register a team for Bowling for Backpacks and bring Christmas-in-July energy to back-to-school support for students and families.",
  includes: [
    "One team lane",
    "Bowling session access",
    "Team captain registration",
    "Bowler names can be added later",
  ],
};

export const bowlingRegistrationOptions: BowlingOption[] = [
  teamRegistration,
  {
    id: "sponsorship",
    name: "Sponsor the Event",
    price: 5000,
    description:
      "Sponsorships help cover the Christmas-in-July event and provide direct support for students and families preparing for the school year.",
    includes: [
      "Event recognition",
      "Sponsor logo placeholder",
      "Staff follow-up",
      "Optional team lane depending on level",
    ],
  },
  {
    id: "lane-sponsor",
    name: "Sponsor a Lane",
    price: 500,
    description:
      "Sponsor one lane and help turn a summer-holiday night of fun into practical relief for families.",
    includes: [
      "Lane recognition",
      "Event website recognition",
      "Great for families and small businesses",
    ],
  },
  {
    id: "gift",
    name: "Make a Gift",
    price: 0,
    description:
      "Can't bowl? You can still make a Christmas-in-July gift that helps provide backpacks and school supplies for students in Oklahoma City.",
    includes: [
      "Direct support for backpacks and supplies",
      "Simple donor checkout",
      "No bowler details required",
    ],
  },
];

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

export const getSessionById = (id: string) =>
  bowlingSessions.find((session) => session.id === id);

export const getSponsorshipById = (id: string) =>
  bowlingSponsorships.find((sponsorship) => sponsorship.id === id);

export const getRegistrationOptionById = (id: string) =>
  bowlingRegistrationOptions.find((option) => option.id === id);

export const sampleBowlingRegistrations: BowlingRegistrationRecord[] = [
  {
    id: "BFB-A1001",
    createdAt: "2026-04-24T15:30:00.000Z",
    registrationType: "team",
    packageId: "team",
    buyerFirstName: "Taylor",
    buyerLastName: "Brooks",
    buyerEmail: "taylor@example.com",
    buyerPhone: "405-555-0111",
    organization: "Brooks Family",
    teamName: "The Backpack Crew",
    sessionId: "family-night",
    sessionName: "Community & Family Session",
    bowlers: [
      {
        firstName: "Taylor",
        lastName: "Brooks",
        email: "taylor@example.com",
        phone: "405-555-0111",
        notes: "",
      },
      {
        firstName: "Morgan",
        lastName: "Brooks",
        email: "",
        phone: "",
        notes: "",
      },
    ],
    sponsorLogoName: "",
    optionalGift: 250,
    notes: "Preview data only.",
    paymentPreference: "card",
    saveTeamLink: true,
    packageName: "Team Registration",
    laneCount: 1,
    subtotal: 750,
    donationTotal: 250,
    grandTotal: 1000,
    paymentStatus: "pending",
    exportStatus: "not_exported",
  },
  {
    id: "BFB-A1002",
    createdAt: "2026-04-24T16:30:00.000Z",
    registrationType: "sponsorship",
    packageId: "corporate-session",
    buyerFirstName: "Jamie",
    buyerLastName: "Nguyen",
    buyerEmail: "jamie@example.com",
    buyerPhone: "405-555-0134",
    organization: "Northline Partners",
    teamName: "Northline Rollers",
    sessionId: "corporate-session",
    sessionName: "Corporate Team Session",
    bowlers: [],
    sponsorLogoName: "northline-logo.png",
    optionalGift: 0,
    notes: "Needs invoice follow-up.",
    paymentPreference: "invoice",
    saveTeamLink: true,
    packageName: "Corporate Team Session Sponsor",
    laneCount: 1,
    subtotal: 5000,
    donationTotal: 0,
    grandTotal: 5000,
    paymentStatus: "invoice_requested",
    exportStatus: "needs_review",
  },
  {
    id: "BFB-A1003",
    createdAt: "2026-04-24T17:00:00.000Z",
    registrationType: "lane-sponsor",
    packageId: "lane-sponsor",
    buyerFirstName: "Casey",
    buyerLastName: "Reed",
    buyerEmail: "casey@example.com",
    buyerPhone: "405-555-0158",
    organization: "Reed Realty",
    teamName: "",
    sessionId: "",
    sessionName: "",
    bowlers: [],
    sponsorLogoName: "",
    optionalGift: 100,
    notes: "Logo pending.",
    paymentPreference: "check",
    saveTeamLink: false,
    packageName: "Lane Sponsor",
    laneCount: 0,
    subtotal: 500,
    donationTotal: 100,
    grandTotal: 600,
    paymentStatus: "check_pledged",
    exportStatus: "not_exported",
  },
];
