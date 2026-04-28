import { bowlingEventConfig } from "@/lib/bowling/config";
import { eventConfig as galaEventConfig } from "@/lib/gala/config";

export type CityCenterEvent = {
  id: string;
  name: string;
  label: string;
  summary: string;
  date: string;
  venue: string;
  city: string;
  href: string;
  adminHref: string;
  primaryAction: string;
  status: "registering" | "building";
  image: string;
};

export type UpcomingInitiative = {
  name: string;
  timing: string;
  focus: string;
  status: "registering" | "planning" | "building";
};

export const cityCenterEvents: CityCenterEvent[] = [
  {
    id: "bowling-for-backpacks",
    name: bowlingEventConfig.name,
    label: "Christmas in July",
    summary:
      "Teams, lanes, sponsorships, and gifts that help students start the school year with practical support.",
    date: bowlingEventConfig.date,
    venue: bowlingEventConfig.venue,
    city: bowlingEventConfig.city,
    href: "/bowling-for-backpacks",
    adminHref: "/admin/bowling-for-backpacks",
    primaryAction: "Register or sponsor",
    status: "registering",
    image: "/bowling/back-to-school-25-500.jpg",
  },
  {
    id: "stories-from-the-center",
    name: galaEventConfig.name,
    label: "Annual Gala",
    summary:
      "A gathered evening of stories, tables, sponsorship, auction activity, and support for City Center's work.",
    date: galaEventConfig.season,
    venue: galaEventConfig.venue,
    city: galaEventConfig.city,
    href: "/gala",
    adminHref: "/admin/gala",
    primaryAction: "View event",
    status: "building",
    image: "/bowling/back-to-school-25-540.jpg",
  },
];

export const upcomingInitiatives: UpcomingInitiative[] = [
  {
    name: "Christmas in July",
    timing: "July 2026",
    focus: "Back 2 School support through teams, lanes, sponsorships, and gifts.",
    status: "registering",
  },
  {
    name: "Stakeholders Appreciation | Jasco's Trophy Pinning",
    timing: "2026",
    focus: "A focused appreciation moment for partners, stakeholders, and community leadership.",
    status: "planning",
  },
  {
    name: "Stories From the Center - 9th Annual Gala",
    timing: "Fall 2026",
    focus: "City Center's annual gathered evening for sponsorship, tables, stories, and generosity.",
    status: "building",
  },
  {
    name: "Giving Tuesday",
    timing: "December 2026",
    focus: "A year-end giving push that keeps supporters informed and ready to participate.",
    status: "planning",
  },
  {
    name: "Christmas 2026",
    timing: "December 2026",
    focus: "Holiday outreach for families and neighbors connected to City Center.",
    status: "planning",
  },
];

export const activeEventCount = cityCenterEvents.length;
