import Image from "next/image";
import { Target, UsersRound } from "lucide-react";
import {
  bowlingEventConfig,
  sampleBowlingRegistrations,
} from "@/lib/bowling/config";
import { bowlingPhotos } from "@/lib/bowling/photos";
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
  const records = registrations ?? sampleBowlingRegistrations;
  const isPreview = registrations === undefined;
  const committedTeams = records
    .filter(
      (registration) =>
        (registration.registrationType === "team" ||
          registration.registrationType === "sponsorship") &&
        Boolean(registration.teamName || registration.organization),
    )
    .slice(0, 6);
  const raised = records.reduce((sum, registration) => sum + registration.grandTotal, 0);
  const progress = Math.min(
    100,
    Math.round((raised / bowlingEventConfig.fundraisingGoal) * 100),
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
            Participating teams and visible progress help supporters know the
            event is moving. Confirmed commitments can be added here as they
            come in.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
          <div className="rounded-sm bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-heading text-xs font-black uppercase text-bfb-navy">
                  Fundraising tracker
                </p>
                <p className="mt-3 font-heading text-4xl font-black text-bfb-ink">
                  {formatCurrency(raised)}
                </p>
                <p className="mt-2 text-sm leading-6 text-bfb-ink/65">
                  Goal: {formatCurrency(bowlingEventConfig.fundraisingGoal)}
                  {isPreview ? " with preview commitments" : ""}
                </p>
              </div>
              <Target aria-hidden="true" className="text-bfb-green" size={32} />
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm font-bold text-bfb-ink/60">
                <span>{progress}% funded</span>
                <span>
                  {formatCurrency(Math.max(0, bowlingEventConfig.fundraisingGoal - raised))} to go
                </span>
              </div>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-bfb-light">
                <span
                  className="block h-full rounded-full bg-bfb-green"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-sm bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-heading text-xs font-black uppercase text-bfb-navy">
                  Participating teams
                </p>
                <h3 className="mt-3 font-heading text-2xl font-black text-bfb-ink">
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
