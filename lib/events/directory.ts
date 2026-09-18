import { bowlingEventConfig } from "@/lib/bowling/config";
import { eventConfig as galaEventConfig } from "@/lib/gala/config";
import { galaPhotos } from "@/lib/gala/photos";

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
  status: "registering" | "building" | "complete";
  image: string;
};

export type UpcomingInitiative = {
  name: string;
  timing: string;
  focus: string;
  status: "registering" | "planning" | "building" | "complete";
};

// The first entry is featured on the home page as "Now registering".
export const cityCenterEvents: CityCenterEvent[] = [
  {
    id: "stories-from-the-center",
    name: galaEventConfig.name,
    label: `${galaEventConfig.edition} / ${galaEventConfig.theme}`,
    summary:
      "An evening of dinner, stories, and auction at City + State, supporting City Center's work with youth and families. Registration closes October 15.",
    date: galaEventConfig.date,
    venue: galaEventConfig.venue,
    city: galaEventConfig.city,
    href: "/gala",
    adminHref: "/admin/gala",
    primaryAction: "Register or host a table",
    status: "registering",
    image: galaPhotos.hero.src,
  },
  {
    id: "bowling-for-backpacks",
    name: bowlingEventConfig.name,
    label: "Christmas in July",
    summary:
      "Teams, lanes, sponsorships, and gifts that helped students start the school year with practical support. Thank you to every team and sponsor.",
    date: bowlingEventConfig.date,
    venue: bowlingEventConfig.venue,
    city: bowlingEventConfig.city,
    href: "/bowling-for-backpacks",
    adminHref: "/admin/bowling-for-backpacks",
    primaryAction: "See the recap",
    status: "complete",
    image: "/bowling/back-to-school-25-500.jpg",
  },
];

export const upcomingInitiatives: UpcomingInitiative[] = [
  {
    name: "Christmas in July",
    timing: "July 16, 2026",
    focus: "Back 2 School support through teams, lanes, sponsorships, and gifts.",
    status: "complete",
  },
  {
    name: "Stakeholders Appreciation | Jasco's Trophy Pinning",
    timing: "2026",
    focus: "A focused appreciation moment for partners, stakeholders, and community leadership.",
    status: "planning",
  },
  {
    name: "Stories From the Center - 9th Annual Gala",
    timing: "October 30, 2026",
    focus: "Welcome to Our Neighborhood: dinner, stories, and auction at City + State. Registration closes October 15.",
    status: "registering",
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
