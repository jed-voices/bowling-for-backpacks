import { ArrowRight, Check, Trophy } from "lucide-react";
import { bowlingSponsorships } from "@/lib/bowling/config";
import { buildBowlingSponsorshipSummary } from "@/lib/bowling/sponsorship-progress";
import type {
  BowlingRegistrationRecord,
  BowlingSponsorship,
} from "@/lib/bowling/types";
import { formatCurrency } from "@/lib/bowling/validation";

const availableCtaLabels: Record<string, string> = {
  "team-sponsor": "Register a Team",
  "lane-sponsor": "Sponsor a Lane",
};

type BowlingSponsorshipGridProps = {
  registrations?: BowlingRegistrationRecord[];
};

export function BowlingSponsorshipGrid({ registrations }: BowlingSponsorshipGridProps) {
  const sponsorshipSummary = buildBowlingSponsorshipSummary(registrations);

  return (
    <section id="sponsorships" className="bg-white py-16 sm:py-20" aria-labelledby="bowling-sponsors">
      <div className="bfb-shell">
        <div className="grid gap-8 lg:grid-cols-[0.66fr_1fr] lg:items-end">
          <div>
            <p className="bfb-eyebrow">Sponsorships</p>
            <h2 id="bowling-sponsors" className="bfb-heading mt-4">
              Sponsorship momentum for Back 2 School.
            </h2>
          </div>
          <p className="bfb-copy">
            Secured gifts are already moving Christmas in July toward its goal.
            The remaining opportunities give sponsors clear ways to stand with
            Oklahoma City students and families.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SummaryTile label="Raised" value={formatCurrency(sponsorshipSummary.totalRaised)} />
          <SummaryTile label="Sponsored lanes" value={sponsorshipSummary.sponsoredLanes.toString()} />
          <SummaryTile
            label="Secured sponsorships"
            value={sponsorshipSummary.securedSponsorships.toString()}
          />
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {bowlingSponsorships.map((sponsor) => {
            const progressItem = sponsorshipSummary.itemMap[sponsor.id];
            const isSponsored = progressItem?.isSponsored ?? sponsor.status === "sponsored";

            return (
              <SponsorshipCard
                key={sponsor.id}
                sponsor={sponsor}
                isSponsored={isSponsored}
                statusLabel={progressItem?.progressLabel}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-bfb-ink/10 bg-bfb-light/70 p-4">
      <p className="font-heading text-xs font-black uppercase text-bfb-navy">{label}</p>
      <p className="mt-2 font-heading text-2xl font-black uppercase text-bfb-ink">{value}</p>
    </div>
  );
}

function SponsorshipCard({
  sponsor,
  isSponsored,
  statusLabel,
}: {
  sponsor: BowlingSponsorship;
  isSponsored: boolean;
  statusLabel?: string;
}) {
  const isFeatured = sponsor.featured;
  const sponsorName = sponsor.sponsorName?.trim();
  const ctaLabel =
    availableCtaLabels[sponsor.id] ?? "Reserve This Sponsorship";
  const baseClasses = isFeatured
    ? "border-bfb-navy bg-bfb-navy text-white md:col-span-2"
    : isSponsored
      ? "border-red-200 bg-bfb-light/70 text-bfb-ink"
      : "border-bfb-ink/10 bg-white text-bfb-ink";
  const textMuted = isFeatured ? "text-white/76" : "text-bfb-ink/68";
  const headingColor = isFeatured ? "text-white" : "text-bfb-ink";
  const priceColor = isFeatured ? "text-white" : "text-bfb-navy";

  return (
    <article
      className={`relative flex min-h-full overflow-hidden rounded-sm border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${baseClasses}`}
    >
      {isSponsored ? (
        <div className="pointer-events-none absolute -right-14 top-7 w-52 rotate-45 bg-red-700 py-2 text-center font-heading text-xs font-black uppercase text-white shadow-sm">
          Sponsored!
        </div>
      ) : null}

      <div className="flex min-h-full w-full flex-col">
        <Trophy
          aria-hidden="true"
          className={isFeatured ? "text-bfb-green" : isSponsored ? "text-red-700" : "text-bfb-green"}
          size={24}
        />
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className={`font-heading text-xl font-black leading-tight ${headingColor}`}>
              {sponsor.name}
            </h3>
            <p className={`mt-3 font-heading text-3xl font-black ${priceColor}`}>
              {formatCurrency(sponsor.price)}
            </p>
          </div>
          <span
            className={`rounded-sm px-3 py-2 font-heading text-xs font-black uppercase ${
              isSponsored
                ? "bg-red-700 text-white"
                : isFeatured
                  ? "bg-white text-bfb-navy"
                  : "bg-bfb-green/22 text-bfb-ink"
            }`}
          >
            {sponsor.lanes > 0
              ? `${sponsor.lanes} ${sponsor.lanes === 1 ? "Lane" : "Lanes"}`
              : "Recognition"}
          </span>
        </div>

        <p className={`mt-4 text-sm leading-6 ${textMuted}`}>
          {isSponsored && sponsor.impactMessage ? sponsor.impactMessage : sponsor.description}
        </p>

        {isSponsored ? (
          <div
            className={`mt-5 rounded-sm border p-4 ${
              isFeatured
                ? "border-white/18 bg-white/10"
                : "border-red-200 bg-white"
            }`}
          >
            <p className={`font-heading text-xs font-black uppercase ${isFeatured ? "text-bfb-green" : "text-red-700"}`}>
              This opportunity has been generously sponsored
            </p>
            <p className={`mt-2 text-sm font-semibold leading-5 ${textMuted}`}>
              {sponsorName
                ? `Public recognition: ${sponsorName}`
                : statusLabel ?? "Sponsor name needed"}
            </p>
          </div>
        ) : null}

        <ul className="mt-5 space-y-3 pb-6">
          {sponsor.recognition.map((benefit) => (
            <li
              key={benefit}
              className={`flex gap-2 text-sm leading-5 ${textMuted}`}
            >
              <Check aria-hidden="true" className="mt-0.5 shrink-0 text-bfb-green" size={16} />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {isSponsored ? (
          <span
            className={`mt-auto inline-flex min-h-12 items-center justify-between gap-3 rounded-sm px-5 py-3 font-heading text-sm font-black uppercase ${
              isFeatured
                ? "bg-white/12 text-white"
                : "border border-bfb-ink/10 bg-white text-bfb-navy"
            }`}
          >
            Sponsorship Secured
            <Check aria-hidden="true" size={16} />
          </span>
        ) : (
          <a
            href="#registration"
            className={`mt-auto inline-flex min-h-12 items-center justify-between gap-3 rounded-sm px-5 py-3 font-heading text-sm font-black uppercase transition ${
              isFeatured
                ? "bg-white text-bfb-navy hover:bg-bfb-green"
                : "border border-bfb-navy/20 bg-white text-bfb-navy hover:border-bfb-blue hover:bg-bfb-light/60"
            }`}
          >
            {ctaLabel}
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        )}
      </div>
    </article>
  );
}
