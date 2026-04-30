import {
  bowlingEventConfig,
  bowlingSessions,
  bowlingSponsorships,
  getSponsorshipById,
} from "./config";
import { committedBowlingRegistrations } from "./records";
import type { BowlingRegistrationRecord, BowlingSponsorship } from "./types";

export type BowlingSponsorshipProgressItem = {
  id: BowlingSponsorship["id"];
  label: string;
  detail: string;
  remainingLabel: string;
  progressLabel: string;
  progress: number;
  isSponsored: boolean;
  committedCount: number;
};

export type BowlingSponsorshipSummary = {
  totalRaised: number;
  remainingToGoal: number;
  fundraisingGoal: number;
  progress: number;
  sponsoredLanes: number;
  totalLanes: number;
  securedSponsorships: number;
  availableSponsorships: number;
  items: BowlingSponsorshipProgressItem[];
  itemMap: Record<BowlingSponsorship["id"], BowlingSponsorshipProgressItem>;
};

const repeatableSponsorshipIds = new Set(["team-sponsor", "lane-sponsor"]);

const currency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const laneLabel = (lanes: number) => {
  if (lanes <= 0) {
    return "Lane recognition";
  }

  return `Includes ${lanes} ${lanes === 1 ? "lane" : "lanes"}`;
};

const recordMatchesSponsorship = (
  sponsor: BowlingSponsorship,
  registration: BowlingRegistrationRecord,
) => {
  if (sponsor.id === "team-sponsor") {
    return registration.registrationType === "team";
  }

  if (sponsor.id === "lane-sponsor") {
    return registration.registrationType === "lane-sponsor";
  }

  const registeredSponsorship = getSponsorshipById(registration.packageId);

  return (
    registration.registrationType === "sponsorship" &&
    registeredSponsorship?.id === sponsor.id
  );
};

export const buildBowlingSponsorshipSummary = (
  registrations?: BowlingRegistrationRecord[],
): BowlingSponsorshipSummary => {
  const records = committedBowlingRegistrations(registrations ?? []);
  const staticallySecuredSponsors = bowlingSponsorships.filter(
    (sponsor) => sponsor.status === "sponsored",
  );
  const staticallySecuredIds = new Set(
    staticallySecuredSponsors.map((sponsor) => sponsor.id),
  );
  const liveEventRecords = records.filter((registration) => {
    if (registration.registrationType === "gift") {
      return false;
    }

    const registeredSponsorship = getSponsorshipById(registration.packageId);

    return !registeredSponsorship || !staticallySecuredIds.has(registeredSponsorship.id);
  });
  const liveSecuredSingleSponsorIds = new Set(
    liveEventRecords
      .map((registration) => getSponsorshipById(registration.packageId)?.id)
      .filter(
        (id): id is string => Boolean(id && !repeatableSponsorshipIds.has(id)),
      ),
  );

  const staticRaised = staticallySecuredSponsors.reduce(
    (sum, sponsor) => sum + sponsor.price,
    0,
  );
  const liveRaised = liveEventRecords.reduce(
    (sum, registration) => sum + registration.grandTotal,
    0,
  );
  const totalRaised = staticRaised + liveRaised;
  const fundraisingGoal = bowlingEventConfig.fundraisingGoal;
  const remainingToGoal = Math.max(0, fundraisingGoal - totalRaised);
  const progress =
    fundraisingGoal > 0
      ? Math.min(100, Math.round((totalRaised / fundraisingGoal) * 100))
      : 0;
  const staticLanes = staticallySecuredSponsors.reduce(
    (sum, sponsor) => sum + sponsor.lanes,
    0,
  );
  const liveLanes = liveEventRecords.reduce((sum, registration) => {
    if (registration.registrationType === "lane-sponsor") {
      return sum + 1;
    }

    if (
      registration.registrationType === "team" ||
      registration.registrationType === "sponsorship"
    ) {
      return sum + Math.max(1, registration.laneCount);
    }

    return sum;
  }, 0);
  const sponsoredLanes = staticLanes + liveLanes;
  const securedSponsorships =
    staticallySecuredSponsors.length + liveEventRecords.length;
  const availableSponsorships = bowlingSponsorships.filter(
    (sponsor) =>
      sponsor.status === "available" && !liveSecuredSingleSponsorIds.has(sponsor.id),
  ).length;
  const totalLanes = bowlingSessions.reduce(
    (sum, session) => sum + session.laneCapacity,
    0,
  );

  const items = bowlingSponsorships.map((sponsor) => {
    const matchingRecords = records.filter((registration) =>
      recordMatchesSponsorship(sponsor, registration),
    );
    const dynamicallySecured =
      sponsor.status === "available" &&
      !repeatableSponsorshipIds.has(sponsor.id) &&
      matchingRecords.length > 0;
    const isSponsored = sponsor.status === "sponsored" || dynamicallySecured;
    const sponsorName = sponsor.sponsorName?.trim();

    return {
      id: sponsor.id,
      label: isSponsored ? "Secured sponsorship" : "Available opportunity",
      detail: laneLabel(sponsor.lanes),
      remainingLabel: isSponsored ? "Sponsored!" : "Available",
      progressLabel: isSponsored
        ? sponsorName
          ? `Sponsor: ${sponsorName}`
          : "Sponsor name needed"
        : `${currency(sponsor.price)} level`,
      progress: isSponsored ? 100 : 0,
      isSponsored,
      committedCount: matchingRecords.length,
    };
  });
  const itemMap = Object.fromEntries(
    items.map((item) => [item.id, item]),
  ) as Record<BowlingSponsorship["id"], BowlingSponsorshipProgressItem>;

  return {
    totalRaised,
    remainingToGoal,
    fundraisingGoal,
    progress,
    sponsoredLanes,
    totalLanes,
    securedSponsorships,
    availableSponsorships,
    items,
    itemMap,
  };
};

export const buildBowlingSponsorshipProgress = (
  registrations?: BowlingRegistrationRecord[],
): Record<BowlingSponsorship["id"], BowlingSponsorshipProgressItem> =>
  buildBowlingSponsorshipSummary(registrations).itemMap;
