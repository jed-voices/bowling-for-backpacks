import { ArrowRight, Check, Trophy } from "lucide-react";
import { bowlingSponsorships } from "@/lib/bowling/config";
import {
  buildBowlingSponsorshipProgress,
  type BowlingSponsorshipProgressItem,
} from "@/lib/bowling/sponsorship-progress";
import type { BowlingRegistrationRecord } from "@/lib/bowling/types";
import { formatCurrency } from "@/lib/bowling/validation";

const sponsorCtaLabels = {
  "event-sponsor": "Become a Sponsor",
  "team-sponsor": "Register a Team",
  "lane-sponsor": "Sponsor a Lane",
} as const;

type BowlingSponsorshipGridProps = {
  registrations?: BowlingRegistrationRecord[];
};

export function BowlingSponsorshipGrid({ registrations }: BowlingSponsorshipGridProps) {
  const sponsorshipProgress = buildBowlingSponsorshipProgress(registrations);

  return (
    <section id="sponsorships" className="bg-white py-16 sm:py-20" aria-labelledby="bowling-sponsors">
      <div className="bfb-shell">
        <div className="grid gap-8 lg:grid-cols-[0.66fr_1fr] lg:items-end">
          <div>
            <p className="bfb-eyebrow">Sponsorships</p>
            <h2 id="bowling-sponsors" className="bfb-heading mt-4">
              Three clear ways to support Back 2 School.
            </h2>
          </div>
          <p className="bfb-copy">
            Lead the full event, reserve a team spot, or sponsor one lane for
            another group. Each option keeps the registration path simple while
            helping students begin the school year with practical support.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {bowlingSponsorships.map((sponsor) => (
            <article
              key={sponsor.id}
              className={`flex min-h-full flex-col rounded-sm border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${
                sponsor.featured
                  ? "border-bfb-navy bg-bfb-navy text-white"
                  : "border-bfb-ink/10 bg-white text-bfb-ink"
              }`}
            >
              <Trophy
                aria-hidden="true"
                className={sponsor.featured ? "text-bfb-green" : "text-bfb-green"}
                size={24}
              />
              <h3
                className={`mt-5 font-heading text-xl font-black leading-tight ${
                  sponsor.featured ? "text-white" : "text-bfb-ink"
                }`}
              >
                {sponsor.name}
              </h3>
              <p
                className={`mt-3 font-heading text-3xl font-black ${
                  sponsor.featured ? "text-white" : "text-bfb-navy"
                }`}
              >
                {formatCurrency(sponsor.price)}
              </p>
              <p
                className={`mt-4 text-sm leading-6 ${
                  sponsor.featured ? "text-white/75" : "text-bfb-ink/70"
                }`}
              >
                {sponsor.description}
              </p>
              {sponsor.id === "event-sponsor" ? (
                <SponsorMeasure
                  featured
                  item={sponsorshipProgress[sponsor.id]}
                />
              ) : null}
              {sponsor.id === "team-sponsor" ? (
                <SponsorMeasure item={sponsorshipProgress[sponsor.id]} />
              ) : null}
              {sponsor.id === "lane-sponsor" ? (
                <SponsorMeasure item={sponsorshipProgress[sponsor.id]} />
              ) : null}
              <ul className="mt-5 space-y-3 pb-6">
                {sponsor.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className={`flex gap-2 text-sm leading-5 ${
                      sponsor.featured ? "text-white/80" : "text-bfb-ink/70"
                    }`}
                  >
                    <Check aria-hidden="true" className="mt-0.5 shrink-0 text-bfb-green" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#registration"
                className={`mt-auto inline-flex min-h-12 items-center justify-between gap-3 rounded-sm px-5 py-3 font-heading text-sm font-black uppercase transition ${
                  sponsor.featured
                    ? "bg-white text-bfb-navy hover:bg-bfb-green"
                    : "border border-bfb-navy/20 bg-white text-bfb-navy hover:border-bfb-blue hover:bg-bfb-light/60"
                }`}
              >
                {sponsorCtaLabels[sponsor.id as keyof typeof sponsorCtaLabels]}
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorMeasure({
  item,
  featured = false,
}: {
  item: BowlingSponsorshipProgressItem;
  featured?: boolean;
}) {
  return (
    <div
      className={`bfb-sponsor-pulse mt-5 rounded-sm border p-4 ${
        featured
          ? "border-white/20 bg-white/10"
          : "border-bfb-navy/10 bg-bfb-light/65"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`font-heading text-xs font-black uppercase ${
              featured ? "text-bfb-green" : "text-bfb-navy"
            }`}
          >
            {item.label}
          </p>
          <p
            className={`mt-1 text-sm font-semibold leading-5 ${
              featured ? "text-white/72" : "text-bfb-ink/68"
            }`}
          >
            {item.detail}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-sm px-3 py-2 text-sm font-black ${
            featured ? "bg-white text-bfb-navy" : "bg-bfb-green/24 text-bfb-ink"
          }`}
        >
          {item.remainingLabel}
        </span>
      </div>
      <div
        className={`mt-4 flex justify-between gap-3 text-xs font-bold uppercase ${
          featured ? "text-white/62" : "text-bfb-ink/58"
        }`}
      >
        <span>{item.progressLabel}</span>
        <span>{item.progress}%</span>
      </div>
      <div className={`mt-2 h-2.5 overflow-hidden rounded-full ${featured ? "bg-white/18" : "bg-white"}`}>
        <span
          className="block h-full rounded-full bg-bfb-green"
          style={{ width: `${item.progress}%` }}
        />
      </div>
    </div>
  );
}
