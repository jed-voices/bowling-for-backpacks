import type { Metadata } from "next";
import { UsersRound } from "lucide-react";
import { BowlingTeamManager } from "@/components/bowling/BowlingTeamManager";
import { EventGatewayBackLink } from "@/components/events/EventGatewayBackLink";
import { bowlingEventConfig } from "@/lib/bowling/config";
import {
  getBowlingRegistrationByAccessToken,
  isBowlingDatabaseConfigured,
} from "@/lib/bowling/database";
import { buildBowlerList, getsTeamManagementLink } from "@/lib/bowling/validation";

export const metadata: Metadata = {
  title: "Bowling Team",
};

type TeamPageProps = {
  params: Promise<{ registrationId: string }>;
};

export default async function BowlingTeamPage({ params }: TeamPageProps) {
  const { registrationId: accessToken } = await params;
  const isDatabaseConfigured = isBowlingDatabaseConfigured();
  const registration = isDatabaseConfigured
    ? await getBowlingRegistrationByAccessToken(accessToken).catch(() => null)
    : null;
  const canSave = Boolean(
    registration &&
      getsTeamManagementLink(registration.registrationType) &&
      registration.saveTeamLink,
  );
  const initialTeamName = registration?.teamName ?? "";
  const initialBowlers = buildBowlerList(registration?.bowlers ?? []);

  return (
    <main className="min-h-screen bg-bfb-cream py-16">
      <div className="bfb-shell max-w-4xl">
        <EventGatewayBackLink tone="bowling" />
        <section className="mt-8 rounded-sm border border-bfb-ink/10 bg-white p-8 shadow-soft sm:p-10">
          <UsersRound aria-hidden="true" className="text-bfb-blue" size={42} />
          <p className="bfb-eyebrow mt-8">Team builder</p>
          <h1 className="mt-4 font-heading text-4xl font-black leading-tight text-bfb-ink sm:text-5xl">
            {canSave ? "Your team link is ready." : "Team updates need City Center help."}
          </h1>
          <p className="bfb-copy mt-6">
            {canSave
              ? `Confirmation code ${registration?.id} has a dedicated captain link for bowler names and team updates. Keep this page handy as your group gets ready for ${bowlingEventConfig.name}.`
              : "This team-management link is invalid or no longer available. Event sponsors, lane sponsors, and gift donors can contact City Center for any needed updates."}
          </p>
          {registration ? (
            <div className="mt-6 grid gap-4 rounded-sm bg-bfb-light p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase text-bfb-ink/50">Registration</p>
                <p className="mt-2 font-heading text-lg font-black text-bfb-ink">
                  {registration.packageName}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-bfb-ink/50">Session</p>
                <p className="mt-2 font-heading text-lg font-black text-bfb-ink">
                  {registration.sessionName || "No session selected"}
                </p>
              </div>
            </div>
          ) : null}
          {canSave ? (
            <BowlingTeamManager
              accessToken={accessToken}
              initialTeamName={initialTeamName}
              initialBowlers={initialBowlers}
              canSave={canSave}
            />
          ) : (
            <div className="mt-8 rounded-sm border border-bfb-ink/10 bg-bfb-cream p-5 text-base leading-7 text-bfb-ink/70 sm:p-6">
              Public bowler updates are only available for Team Sponsor / Team
              Registration records. City Center can still help with sponsor,
              lane, or gift updates directly.
            </div>
          )}
          <p className="mt-4 text-base leading-7 text-bfb-ink/70">
            Need help? Contact {bowlingEventConfig.contactName}, City Center&apos;s{" "}
            {bowlingEventConfig.contactTitle}, at{" "}
            <a
              href={`mailto:${bowlingEventConfig.contactEmail}`}
              className="font-bold text-bfb-navy underline underline-offset-4"
            >
              {bowlingEventConfig.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
