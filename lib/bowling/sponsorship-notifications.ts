import { bowlingEventConfig, bowlingSponsorships } from "./config";
import type { BowlingSponsorship } from "./types";

export const sponsorNameNotificationRecipient = {
  name: "Kimberly Winston",
  email: "kimberly@okcitycenter.org",
};

export const sponsorNameNeededSubject =
  "Sponsor Name Needed for Christmas in July Sponsorship";

export const buildSponsorNameNeededEmail = (sponsorship: BowlingSponsorship) => ({
  to: sponsorNameNotificationRecipient.email,
  subject: sponsorNameNeededSubject,
  body: `Hi Kimberly,

A sponsorship has been marked as secured on the ${bowlingEventConfig.name} page, but the sponsor name still needs to be added in the dashboard.

Please update the sponsor name for:
${sponsorship.name}

Once updated, the public sponsorship display can show the correct sponsor name.

Thank you!`,
});

export const getSponsorNameNotificationNeeds = (
  sponsorships: BowlingSponsorship[] = bowlingSponsorships,
) =>
  sponsorships.filter(
    (sponsorship) =>
      sponsorship.status === "sponsored" &&
      sponsorship.notificationRequired &&
      !sponsorship.notificationSent &&
      !sponsorship.sponsorName?.trim(),
  );

export const notifySponsorNameNeededOnce = async (
  sponsorship: BowlingSponsorship,
) => {
  void buildSponsorNameNeededEmail(sponsorship);

  // TODO: Wire this to a real email provider and persistent sponsorship table
  // before calling it from a server route. The persistent store needs a
  // notification_sent flag per sponsorship level so Kimberly is emailed once,
  // not on every page render or deployment.
  return {
    sent: false as const,
    reason: "email_provider_and_persistent_notification_state_not_configured",
  };
};
