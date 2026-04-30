import { bowlingSessions, sampleBowlingRegistrations } from "./config";
import { committedBowlingRegistrations } from "./records";
import type { BowlingRegistrationRecord, BowlingSponsorship } from "./types";
import { remainingLanes, remainingLanesFromRegistrations } from "./validation";

export type BowlingSponsorshipProgressItem = {
  id: BowlingSponsorship["id"];
  label: string;
  detail: string;
  remainingLabel: string;
  progressLabel: string;
  progress: number;
};

export const buildBowlingSponsorshipProgress = (
  registrations?: BowlingRegistrationRecord[],
): Record<BowlingSponsorship["id"], BowlingSponsorshipProgressItem> => {
  const records = committedBowlingRegistrations(
    registrations ?? sampleBowlingRegistrations,
  );
  const totalSessionSpots = bowlingSessions.reduce(
    (sum, session) => sum + session.laneCapacity,
    0,
  );
  const remainingTeamSpots = bowlingSessions.reduce(
    (sum, session) =>
      sum +
      (registrations
        ? remainingLanesFromRegistrations(session.id, registrations)
        : remainingLanes(session.id)),
    0,
  );
  const heldTeamSpots = Math.max(0, totalSessionSpots - remainingTeamSpots);
  const teamSpotProgress =
    totalSessionSpots > 0
      ? Math.round((heldTeamSpots / totalSessionSpots) * 100)
      : 0;

  const totalEventSponsors = 1;
  const securedEventSponsors = records.filter(
    (registration) =>
      registration.packageId === "event-sponsor" ||
      registration.packageName === "Event Sponsor",
  ).length;
  const remainingEventSponsors = Math.max(
    0,
    totalEventSponsors - securedEventSponsors,
  );
  const eventSponsorProgress = Math.min(
    100,
    Math.round((securedEventSponsors / totalEventSponsors) * 100),
  );

  const totalSponsorLanes = totalSessionSpots;
  const sponsoredLanes = records.filter(
    (registration) => registration.registrationType === "lane-sponsor",
  ).length;
  const remainingSponsorLanes = Math.max(0, totalSponsorLanes - sponsoredLanes);
  const laneSponsorProgress =
    totalSponsorLanes > 0
      ? Math.round((sponsoredLanes / totalSponsorLanes) * 100)
      : 0;

  return {
    "event-sponsor": {
      id: "event-sponsor",
      label: "Primary sponsorship",
      detail: "Measured separately from team spots and lane sponsorships.",
      remainingLabel:
        remainingEventSponsors > 0
          ? `${remainingEventSponsors} available`
          : "Primary sponsor secured",
      progressLabel: `${Math.min(
        securedEventSponsors,
        totalEventSponsors,
      )}/${totalEventSponsors} secured`,
      progress: eventSponsorProgress,
    },
    "team-sponsor": {
      id: "team-sponsor",
      label: "Team spots",
      detail: "Measured across both bowling sessions.",
      remainingLabel: `${remainingTeamSpots} spots left`,
      progressLabel: `${heldTeamSpots}/${totalSessionSpots} team spots held`,
      progress: teamSpotProgress,
    },
    "lane-sponsor": {
      id: "lane-sponsor",
      label: "Lane sponsorships",
      detail: "Measured separately from team session availability.",
      remainingLabel: `${remainingSponsorLanes} left`,
      progressLabel: `${sponsoredLanes}/${totalSponsorLanes} lanes sponsored`,
      progress: laneSponsorProgress,
    },
  };
};
