import Image from "next/image";
import { Gift, Target, UsersRound } from "lucide-react";
import {
  bowlingEventConfig,
  sampleBowlingRegistrations,
} from "@/lib/bowling/config";
import { bowlingPhotos } from "@/lib/bowling/photos";
import {
  committedBowlingRegistrations,
  eventParticipationRegistrations,
  giftOnlyRegistrations,
} from "@/lib/bowling/records";
import type { BowlingRegistrationRecord } from "@/lib/bowling/types";
import { formatCurrency } from "@/lib/bowling/validation";

type BowlingMomentumSectionProps = {
  registrations?: BowlingRegistrationRecord[];
};

const eventMoments = [
  {
    image: bowlingPhotos.mission,
    title: "Back 2 School support",
    body: "Past outreach shows the practical pressure families carry before the first day of school.",
  },
  {
    image: bowlingPhotos.support,
    title: "Families seen and supported",
    body: "The goal is more than supplies. It is relief, dignity, and a stronger start.",
  },
];

export function BowlingMomentumSection({ registrations }: BowlingMomentumSectionProps) {
  const records = committedBowlingRegistrations(registrations ?? sampleBowlingRegistrations);
  const eventRecords = eventParticipationRegistrations(records);
  const giftRecords = giftOnlyRegistrations(records);
  const isPreview = registrations === undefined;
  const committedTeams = eventRecords
    .filter(
      (registration) =>
        (registration.registrationType === "team" ||
          registration.registrationType === "sponsorship") &&
        Boolean(registration.teamName || registration.organization),
    )
    .slice(0, 6);
  const sponsorshipRaised = eventRecords.reduce(
    (sum, registration) => sum + registration.grandTotal,
    0,
  );
  const giftTotal = giftRecords.reduce(
    (sum, registration) => sum + registration.donationTotal,
    0,
  );
  const progress = Math.min(
    100,
    Math.round((sponsorshipRaised / bowlingEventConfig.fundraisingGoal) * 100),
  );
  const thermometerFill = progress > 0 ? Math.max(4, progress) : 0;
  const remainingToGoal = Math.max(
    0,
    bowlingEventConfig.fundraisingGoal - sponsorshipRaised,
  );

  return (
    <section className="bg-bfb-light py-16 sm:py-20" aria-labelledby="bowling-momentum">
      <div className="bfb-shell">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1fr] lg:items-end">
          <div>
            <p className="bfb-eyebrow">Event momentum</p>
            <h2 id="bowling-momentum" className="bfb-heading mt-4">
              Progress people can see.
            </h2>
          </div>
          <p className="bfb-copy">
            Sponsorships, team registrations, and lane commitments move the
            event toward its goal. Gift-only support is held separately as a
            generosity pool for supporters who simply want to help.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
          <div className="rounded-sm bg-white p-6 shadow-sm">
            <div className="grid gap-7 sm:grid-cols-[auto_1fr] sm:items-center">
              <div
                className="relative mx-auto flex h-80 w-24 items-end justify-center sm:mx-0"
                aria-label={`${progress}% of the sponsorship goal funded`}
              >
                <div className="absolute bottom-5 h-[17.5rem] w-12 rounded-full border-4 border-bfb-navy/15 bg-bfb-light shadow-inner">
                  <span
                    className="absolute bottom-1 left-1 right-1 rounded-full bg-bfb-green transition-all"
                    style={{ height: `calc(${thermometerFill}% - 0.5rem)` }}
                  />
                </div>
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-bfb-navy/15 bg-bfb-green text-bfb-ink shadow-sm">
                  <Target aria-hidden="true" size={34} />
                </div>
              </div>

              <div>
                <p className="font-heading text-xs font-black uppercase text-bfb-navy">
                  Sponsorship thermometer
                </p>
                <p className="mt-3 font-heading text-4xl font-black leading-none text-bfb-ink sm:text-5xl">
                  {formatCurrency(sponsorshipRaised)}
                </p>
                <p className="mt-2 text-sm leading-6 text-bfb-ink/65">
                  Toward the {formatCurrency(bowlingEventConfig.fundraisingGoal)} Christmas in July goal
                  {isPreview ? " with preview commitments" : ""}.
                </p>
                <div className="mt-6">
                  <div className="flex justify-between gap-4 text-sm font-bold text-bfb-ink/60">
                    <span>{progress}% funded</span>
                    <span>{formatCurrency(remainingToGoal)} to go</span>
                  </div>
                  <div className="mt-3 h-4 overflow-hidden rounded-full bg-bfb-light">
                    <span
                      className="block h-full rounded-full bg-bfb-green"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-sm bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-heading text-xs font-black uppercase text-bfb-navy">
                    Gift-only generosity
                  </p>
                  <h3 className="mt-3 font-heading text-2xl font-black leading-none text-bfb-ink">
                    {formatCurrency(giftTotal)} given freely
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-bfb-ink/65">
                    {giftRecords.length} supporter{giftRecords.length === 1 ? "" : "s"} gave
                    without registering a team or sponsoring a lane.
                  </p>
                </div>
                <Gift aria-hidden="true" className="text-bfb-green" size={32} />
              </div>

              <div className="mt-5 grid gap-3">
                {giftRecords.length > 0 ? (
                  giftRecords.slice(0, 4).map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between gap-4 rounded-sm border border-bfb-ink/10 bg-bfb-cream p-3"
                    >
                      <span className="text-sm font-bold text-bfb-ink">
                        {registration.organization || "City Center supporter"}
                      </span>
                      <span className="font-heading text-sm font-black text-bfb-navy">
                        {formatCurrency(registration.donationTotal)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="rounded-sm border border-bfb-ink/10 bg-bfb-cream p-4 text-sm leading-6 text-bfb-ink/65">
                    Gift-only generosity will appear here as donations are completed.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-sm bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="font-heading text-xs font-black uppercase text-bfb-navy">
                    Participating teams
                  </p>
                  <h3 className="mt-3 font-heading text-2xl font-black leading-none text-bfb-ink">
                    Confirmed commitments
                  </h3>
                </div>
                <UsersRound aria-hidden="true" className="text-bfb-blue" size={32} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {committedTeams.length > 0 ? (
                  committedTeams.map((registration) => (
                    <div
                      key={registration.id}
                      className="rounded-sm border border-bfb-ink/10 bg-bfb-cream p-4"
                    >
                      <p className="font-heading text-base font-black text-bfb-ink">
                        {registration.teamName || registration.organization}
                      </p>
                      <p className="mt-2 text-sm leading-5 text-bfb-ink/60">
                        {registration.packageName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-sm border border-bfb-ink/10 bg-bfb-cream p-4 text-sm leading-6 text-bfb-ink/65 sm:col-span-2">
                    Confirmed teams will appear here as commitments are secured.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {eventMoments.map((moment) => (
            <article
              key={moment.title}
              className="grid overflow-hidden rounded-sm bg-white shadow-sm sm:grid-cols-[0.72fr_1fr]"
            >
              <div className="relative min-h-56">
                <Image
                  src={moment.image.src}
                  alt={moment.image.alt}
                  fill
                  sizes="(min-width: 768px) 32vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="font-heading text-xs font-black uppercase text-bfb-navy">
                  Past event moment
                </p>
                <h3 className="mt-3 font-heading text-2xl font-black leading-tight text-bfb-ink">
                  {moment.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-bfb-ink/65">{moment.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
