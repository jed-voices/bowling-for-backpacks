import { bowlingSessions } from "@/lib/bowling/config";
import {
  isBowlingDatabaseConfigured,
  listBowlingRegistrations,
} from "@/lib/bowling/database";
import {
  committedBowlingRegistrations,
  giftOnlyRegistrations,
} from "@/lib/bowling/records";
import { buildBowlingSponsorshipSummary } from "@/lib/bowling/sponsorship-progress";
import type { BowlingRegistrationRecord } from "@/lib/bowling/types";
import { remainingLanesFromRegistrations } from "@/lib/bowling/validation";
import type { GalaRegistrationRecord } from "@/lib/gala/types";
import { formatCurrency } from "@/lib/gala/validation";
import { isDevelopmentAuthConfigured } from "./development-auth";
import { cityCenterEvents } from "./directory";

type Metric = {
  label: string;
  value: string;
  detail?: string;
};

type FollowUp = {
  label: string;
  count: number;
  detail: string;
};

type ExportLink = {
  label: string;
  href: string;
};

export type EventOperationsSummary = {
  id: string;
  name: string;
  label: string;
  href: string;
  adminHref: string;
  dataSource: "live" | "preview";
  status: "registering" | "building";
  totalValue: number;
  registrationCount: number;
  openPaymentCount: number;
  exportQueueCount: number;
  readinessLabel: string;
  readinessDetail: string;
  metrics: Metric[];
  followUps: FollowUp[];
  exports: ExportLink[];
};

export type LaunchReadinessItem = {
  label: string;
  status: "ready" | "needs_setup" | "planned";
  detail: string;
  nextStep: string;
};

export type DevelopmentDashboard = {
  totalEvents: number;
  totalRegistrations: number;
  totalValue: number;
  totalOpenPayments: number;
  totalExportQueue: number;
  readiness: LaunchReadinessItem[];
  events: EventOperationsSummary[];
};

const openPaymentStatuses = ["invoice_requested", "check_pledged"];

const countOpenBowlingPayments = (registrations: BowlingRegistrationRecord[]) =>
  registrations.filter((registration) =>
    openPaymentStatuses.includes(registration.paymentStatus),
  ).length;

const countOpenGalaPayments = (registrations: GalaRegistrationRecord[]) =>
  registrations.filter((registration) =>
    openPaymentStatuses.includes(registration.paymentStatus),
  ).length;

const countBowlingMissingLogos = (registrations: BowlingRegistrationRecord[]) =>
  registrations.filter(
    (registration) =>
      (registration.registrationType === "sponsorship" ||
        registration.registrationType === "lane-sponsor") &&
      !registration.sponsorLogoName,
  ).length;

const countIncompleteBowlerLists = (registrations: BowlingRegistrationRecord[]) =>
  registrations.filter((registration) => {
    if (registration.laneCount < 1) {
      return false;
    }

    const namedBowlers = registration.bowlers.filter(
      (bowler) => bowler.firstName || bowler.lastName,
    ).length;

    return namedBowlers < 6;
  }).length;

const countIncompleteGuestLists = (registrations: GalaRegistrationRecord[]) =>
  registrations.filter((registration) => {
    const namedGuests = registration.guests.filter(
      (guest) => guest.firstName || guest.lastName,
    ).length;

    return namedGuests < registration.seats;
  }).length;

const countExportQueue = (
  registrations: Array<BowlingRegistrationRecord | GalaRegistrationRecord>,
) =>
  registrations.filter((registration) => registration.exportStatus !== "exported")
    .length;

const hasConfiguredUrl = () =>
  Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL);

const hasStripeSecret = () => Boolean(process.env.STRIPE_SECRET_KEY);

const hasStripeWebhookSecret = () => Boolean(process.env.STRIPE_WEBHOOK_SECRET);

const buildLaunchReadiness = (): LaunchReadinessItem[] => [
  {
    label: "Live domain",
    status: hasConfiguredUrl() ? "ready" : "needs_setup",
    detail: hasConfiguredUrl()
      ? "Production confirmation links and checkout return URLs have a configured site URL."
      : "Production links need a configured site URL.",
    nextStep: hasConfiguredUrl()
      ? "Keep NEXT_PUBLIC_SITE_URL and SITE_URL pointed to okcitycenterevents.org."
      : "Add NEXT_PUBLIC_SITE_URL and SITE_URL in Vercel production.",
  },
  {
    label: "Development login",
    status: isDevelopmentAuthConfigured() ? "ready" : "needs_setup",
    detail: isDevelopmentAuthConfigured()
      ? "Development access credentials are configured for this environment."
      : "Development access is not ready for this environment.",
    nextStep: isDevelopmentAuthConfigured()
      ? "Store the credentials in the City Center password manager."
      : "Add DEVELOPMENT_ADMIN_USERNAME and DEVELOPMENT_ADMIN_PASSWORD in Vercel.",
  },
  {
    label: "Bowling database",
    status: isBowlingDatabaseConfigured() ? "ready" : "needs_setup",
    detail: isBowlingDatabaseConfigured()
      ? "Bowling registrations will persist to Supabase."
      : "Bowling live registrations are not connected in this environment.",
    nextStep: isBowlingDatabaseConfigured()
      ? "Submit one test registration and confirm it appears in Supabase."
      : "Run the Supabase migration and add SUPABASE_URL plus SUPABASE_SERVICE_ROLE_KEY.",
  },
  {
    label: "Bowling card checkout",
    status: hasStripeSecret() ? "ready" : "needs_setup",
    detail: hasStripeSecret()
      ? "Stripe Checkout can create hosted card payment sessions."
      : "Card payments return a local preview confirmation until Stripe is configured.",
    nextStep: hasStripeSecret()
      ? "Run a small test checkout and verify the confirmation page."
      : "Add STRIPE_SECRET_KEY in Vercel production.",
  },
  {
    label: "Stripe payment updates",
    status: hasStripeSecret() && hasStripeWebhookSecret() ? "ready" : "needs_setup",
    detail:
      hasStripeSecret() && hasStripeWebhookSecret()
        ? "Stripe webhooks can mark Bowling registrations paid after checkout."
        : "Paid status will not update automatically until the webhook secret is present.",
    nextStep:
      hasStripeSecret() && hasStripeWebhookSecret()
        ? "Watch the first live webhook event and confirm the admin dashboard updates."
        : "Create the Bowling webhook endpoint in Stripe and add STRIPE_WEBHOOK_SECRET.",
  },
  {
    label: "Gala backend",
    status: "planned",
    detail: "Gala registration, payment, and webhook routes are still in the prototype phase.",
    nextStep: "Build the Gala database layer and Stripe Checkout flow after Bowling is live.",
  },
];

const buildBowlingSummary = async (): Promise<EventOperationsSummary> => {
  const event = cityCenterEvents.find((item) => item.id === "bowling-for-backpacks");
  const liveRegistrations = await listBowlingRegistrations();
  const registrations = committedBowlingRegistrations(liveRegistrations ?? []);
  const dataSource = liveRegistrations ? "live" : "preview";
  const sponsorshipSummary = buildBowlingSponsorshipSummary(registrations);
  const giftOnlyTotal = giftOnlyRegistrations(registrations).reduce(
    (sum, registration) => sum + registration.donationTotal,
    0,
  );
  const totalValue = sponsorshipSummary.totalRaised + giftOnlyTotal;
  const teams = registrations.filter((registration) => registration.laneCount > 0);
  const openPayments = countOpenBowlingPayments(registrations);
  const exportQueue = countExportQueue(registrations);
  const missingLogos = countBowlingMissingLogos(registrations);
  const incompleteBowlers = countIncompleteBowlerLists(registrations);
  const laneStatus = bowlingSessions
    .map((session) => {
      const remaining =
        dataSource === "live"
          ? remainingLanesFromRegistrations(session.id, registrations)
          : Math.max(0, session.laneCapacity - session.registeredTeams);

      return `${session.name}: ${remaining} open`;
    })
    .join(" / ");

  return {
    id: event?.id ?? "bowling-for-backpacks",
    name: event?.name ?? "Christmas in July: Bowling for Backpacks",
    label: event?.label ?? "Christmas in July",
    href: event?.href ?? "/bowling-for-backpacks",
    adminHref: event?.adminHref ?? "/admin/bowling-for-backpacks",
    dataSource,
    status: event?.status ?? "registering",
    totalValue,
    registrationCount: registrations.length,
    openPaymentCount: openPayments,
    exportQueueCount: exportQueue,
    readinessLabel:
      openPayments + exportQueue + missingLogos + incompleteBowlers === 0
        ? "Clean"
        : "Needs follow-up",
    readinessDetail: laneStatus,
    metrics: [
      {
        label: "Registrations",
        value: registrations.length.toString(),
        detail: `${teams.length} team or sponsor lanes`,
      },
      {
        label: "Visible value",
        value: formatCurrency(totalValue),
        detail:
          dataSource === "live"
            ? "Confirmed sponsorships + committed gifts"
            : "Confirmed sponsorships, no live connection",
      },
      {
        label: "Open payments",
        value: openPayments.toString(),
        detail: "Pending, invoice, or check",
      },
      {
        label: "Export queue",
        value: exportQueue.toString(),
        detail: "Not exported or needs review",
      },
    ],
    followUps: [
      {
        label: "Payment follow-up",
        count: openPayments,
        detail: "Confirm card, invoice, and check status.",
      },
      {
        label: "Sponsor logos",
        count: missingLogos,
        detail: "Collect lane and sponsorship recognition assets.",
      },
      {
        label: "Bowler lists",
        count: incompleteBowlers,
        detail: "Ask captains to complete team names.",
      },
    ],
    exports: [
      {
        label: "Donor Export",
        href: "/api/bowling/admin/exports/bloomerang-transactions",
      },
      {
        label: "Ops List",
        href: "/api/bowling/admin/exports/operations",
      },
      {
        label: "Raw Data",
        href: "/api/bowling/admin/exports/backend-json",
      },
    ],
  };
};

const buildGalaSummary = (): EventOperationsSummary => {
  const event = cityCenterEvents.find((item) => item.id === "stories-from-the-center");
  const registrations: GalaRegistrationRecord[] = [];
  const totalValue = registrations.reduce(
    (sum, registration) => sum + registration.grandTotal,
    0,
  );
  const openPayments = countOpenGalaPayments(registrations);
  const exportQueue = countExportQueue(registrations);
  const incompleteGuests = countIncompleteGuestLists(registrations);

  return {
    id: event?.id ?? "stories-from-the-center",
    name: event?.name ?? "Stories From the Center",
    label: event?.label ?? "Annual Gala",
    href: event?.href ?? "/gala",
    adminHref: event?.adminHref ?? "/admin/gala",
    dataSource: "preview",
    status: event?.status ?? "building",
    totalValue,
    registrationCount: registrations.length,
    openPaymentCount: openPayments,
    exportQueueCount: exportQueue,
    readinessLabel: "Prototype",
    readinessDetail:
      "No live Gala registrations are connected yet. This card will populate when the Gala backend is built.",
    metrics: [
      {
        label: "Registrations",
        value: registrations.length.toString(),
        detail: "Live Gala data not connected",
      },
      {
        label: "Visible value",
        value: formatCurrency(totalValue),
        detail: "No live Gala value yet",
      },
      {
        label: "Open payments",
        value: openPayments.toString(),
        detail: "Will populate after launch",
      },
      {
        label: "Export queue",
        value: exportQueue.toString(),
        detail: "Greater Giving and Bloomerang after launch",
      },
    ],
    followUps: [
      {
        label: "Payment follow-up",
        count: openPayments,
        detail: "Will populate after Gala registration is live.",
      },
      {
        label: "Guest lists",
        count: incompleteGuests,
        detail: "Will populate after Gala registration is live.",
      },
      {
        label: "Export review",
        count: exportQueue,
        detail: "Will populate after Gala registration is live.",
      },
    ],
    exports: [
      {
        label: "Sales Import",
        href: "/api/gala/admin/exports/greater-giving-sales",
      },
      {
        label: "Supporter Import",
        href: "/api/gala/admin/exports/greater-giving-supporters",
      },
      {
        label: "Drawing Entries",
        href: "/api/gala/admin/exports/chance-to-win",
      },
      {
        label: "Donor Export",
        href: "/api/gala/admin/exports/bloomerang-transactions",
      },
      {
        label: "Raw Data",
        href: "/api/gala/admin/exports/backend-json",
      },
    ],
  };
};

export const getDevelopmentDashboard = async (): Promise<DevelopmentDashboard> => {
  const events = [await buildBowlingSummary(), buildGalaSummary()];

  return {
    totalEvents: events.length,
    totalRegistrations: events.reduce(
      (sum, event) => sum + event.registrationCount,
      0,
    ),
    totalValue: events.reduce((sum, event) => sum + event.totalValue, 0),
    totalOpenPayments: events.reduce(
      (sum, event) => sum + event.openPaymentCount,
      0,
    ),
    totalExportQueue: events.reduce(
      (sum, event) => sum + event.exportQueueCount,
      0,
    ),
    readiness: buildLaunchReadiness(),
    events,
  };
};

export { formatCurrency };
