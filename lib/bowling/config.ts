import type {
  BowlingOption,
  BowlingRegistrationRecord,
  BowlingSession,
  BowlingSponsorship,
} from "./types";

export const bowlingEventConfig = {
  name: "Christmas in July: Bowling for Backpacks",
  subtitle: "A City Center Back 2 School Fundraiser",
  theme: "Christmas in July",
  date: "July 16, 2026",
  venue: "Andy B's",
  city: "Oklahoma City",
  cause: "Backpacks, school supplies, and practical Back 2 School support for students and families",
  fundraisingGoal: 75000,
  teamPrice: 750,
  lanesPerSession: 21,
  teamSize: 6,
  teamBaseUrl: "/bowling-for-backpacks/team",
  contactName: "Kimberly Winston",
  contactTitle: "Development Director",
  contactEmail: "kimberly@okcitycenter.org",
  fund: "City Center",
  campaign: "2026 Christmas in July: Bowling for Backpacks",
  appeal: "Back 2 School Bash",
  groups: "Christmas in July: Bowling for Backpacks | Back 2 School",
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
    id: "presenting-sponsor",
    name: "Presenting Sponsor",
    price: 15000,
    lanes: 3,
    status: "sponsored",
    description:
      "The lead sponsorship for Christmas in July. This gift anchors the full event and helps move backpacks, school supplies, and meaningful support toward Oklahoma City students.",
    benefits: [
      "Three lanes included",
      "Premier event recognition",
      "Prominent brand placement",
      "Recognition during the bowling sessions",
      "City Center follow-up for public sponsor recognition",
    ],
    recognition: [
      "3 lanes",
      "Premier event recognition",
      "Prominent brand placement",
    ],
    impactMessage:
      "This sponsorship helps place backpacks, school supplies, and meaningful support directly into the hands of Oklahoma City students and families. We are deeply grateful for the generosity behind this gift and the confidence it shows in the next generation of our city.",
    includesTeam: true,
    featured: true,
    sponsorName: "",
    notificationRequired: true,
    notificationSent: false,
    publicDisplay: true,
  },
  {
    id: "back-to-school-sponsor",
    name: "Back-to-School Sponsor",
    price: 10000,
    lanes: 3,
    status: "available",
    description:
      "A major sponsorship that connects your support directly to the Back 2 School effort and creates visible momentum for students and families.",
    benefits: [
      "Three lanes included",
      "Backpack program recognition",
      "Prominent branding",
      "Activation table",
    ],
    recognition: [
      "Backpack program recognition",
      "Prominent branding",
      "Activation table",
    ],
    includesTeam: true,
    notificationRequired: false,
    notificationSent: false,
    publicDisplay: true,
  },
  {
    id: "corporate-session-sponsor",
    name: "Corporate Session Sponsor",
    price: 5000,
    lanes: 2,
    status: "available",
    description:
      "Support the corporate bowling session and help companies rally around practical Back 2 School support for Oklahoma City youth.",
    benefits: [
      "Two lanes included",
      "Event signage",
      "Program recognition",
      "Sponsor table presence",
    ],
    recognition: [
      "Event signage",
      "Program recognition",
      "Sponsor table presence",
    ],
    includesTeam: true,
    notificationRequired: false,
    notificationSent: false,
    publicDisplay: true,
  },
  {
    id: "family-night-sponsor",
    name: "Family Night Sponsor",
    price: 5000,
    lanes: 2,
    status: "sponsored",
    description:
      "A secured sponsorship helping make the family session warm, welcoming, and connected to practical Back 2 School support.",
    benefits: [
      "Two lanes included",
      "Family night recognition",
      "Event signage",
      "City Center follow-up for public sponsor recognition",
    ],
    recognition: ["2 lanes", "Family night recognition", "Event signage"],
    impactMessage:
      "This gift helps create a welcoming family experience around Back-to-School support, giving students and parents a moment of joy, connection, and practical help before the school year begins.",
    includesTeam: true,
    sponsorName: "",
    notificationRequired: true,
    notificationSent: false,
    publicDisplay: true,
  },
  {
    id: "friend-of-city-center-sponsor",
    name: "Friend of City Center Sponsor",
    price: 1000,
    lanes: 1,
    status: "available",
    description:
      "A meaningful entry point for families, small businesses, and community partners who want to stand with City Center students.",
    benefits: [
      "One lane included",
      "Sponsor board listing",
      "Social recognition",
      "Participation",
    ],
    recognition: [
      "Sponsor board listing",
      "Social recognition",
      "Participation",
    ],
    includesTeam: true,
    notificationRequired: false,
    notificationSent: false,
    publicDisplay: true,
  },
  {
    id: "team-sponsor",
    name: "Team Sponsor",
    price: 750,
    lanes: 1,
    status: "available",
    description:
      "Reserve one bowling team for your company, church, family, or friend group and join Christmas in July in person.",
    benefits: [
      "One lane included",
      "Up to six bowlers",
      "Choice of preferred session",
      "Name displayed on bowling lane and event signage",
    ],
    recognition: [
      "Name displayed on bowling lane",
      "Event signage",
    ],
    includesTeam: true,
    notificationRequired: false,
    notificationSent: false,
    publicDisplay: true,
  },
  {
    id: "lane-sponsor",
    name: "Lane Sponsor",
    price: 500,
    lanes: 0,
    status: "available",
    description:
      "Sponsor a lane and help turn Christmas in July into practical support for students starting the school year.",
    benefits: [
      "Name displayed on bowling lane",
      "Event signage",
      "Great option for families, small businesses, and community partners",
    ],
    recognition: [
      "Name displayed on bowling lane",
      "Event signage",
    ],
    notificationRequired: false,
    notificationSent: false,
    publicDisplay: true,
  },
];

const legacySponsorshipAliases: Record<string, string> = {
  "event-sponsor": "corporate-session-sponsor",
};

const directRegistrationSponsorshipIds = new Set(["team-sponsor", "lane-sponsor"]);

export const registerableBowlingSponsorships = bowlingSponsorships.filter(
  (sponsorship) =>
    sponsorship.status === "available" &&
    !directRegistrationSponsorshipIds.has(sponsorship.id),
);

export const getDefaultBowlingSponsorshipId = () =>
  registerableBowlingSponsorships.find(
    (sponsorship) => sponsorship.id === "friend-of-city-center-sponsor",
  )?.id ?? registerableBowlingSponsorships[0]?.id ?? "";

export const isRegisterableBowlingSponsorship = (id: string) =>
  registerableBowlingSponsorships.some(
    (sponsorship) => sponsorship.id === getSponsorshipById(id)?.id,
  );

export const teamRegistration: BowlingOption = {
  id: "team",
  name: "Team Sponsor / Team Registration",
  price: 750,
  description:
    "Register a team for Christmas in July: Bowling for Backpacks and bring joyful energy to Back 2 School support for students and families.",
  includes: [
    "One team spot",
    "Bowling session access",
    "Team captain registration",
    "Bowler names can be added later",
  ],
};

export const bowlingRegistrationOptions: BowlingOption[] = [
  {
    id: "sponsorship",
    name: "Sponsorship",
    price: 1000,
    description:
      "Choose an available sponsorship level for companies, families, or partners ready to lead the Christmas in July effort.",
    includes: [
      "Available sponsorship levels",
      "Sponsor recognition",
      "Included lanes by level",
      "City Center contact for next steps",
    ],
  },
  teamRegistration,
  {
    id: "lane-sponsor",
    name: "Lane Sponsor",
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
      "Can't bowl? You can still make a Christmas in July gift that helps provide backpacks and school supplies for students in Oklahoma City.",
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
  bowlingSponsorships.find((sponsorship) => sponsorship.id === id) ??
  bowlingSponsorships.find(
    (sponsorship) => sponsorship.id === legacySponsorshipAliases[id],
  );

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
    packageId: "corporate-session-sponsor",
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
    packageName: "Corporate Session Sponsor",
    laneCount: 2,
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
