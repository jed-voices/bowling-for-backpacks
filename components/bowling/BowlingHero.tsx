import Image from "next/image";
import {
  ArrowRight,
  Backpack,
  CalendarDays,
  Gift,
  MapPin,
  Snowflake,
  Sun,
} from "lucide-react";
import { EventPageNav } from "@/components/events/EventPageNav";
import { bowlingEventConfig } from "@/lib/bowling/config";
import { bowlingCopy } from "@/lib/bowling/copy";
import { bowlingPhotos } from "@/lib/bowling/photos";
import { buildBowlingSponsorshipSummary } from "@/lib/bowling/sponsorship-progress";
import type { BowlingRegistrationRecord } from "@/lib/bowling/types";
import { formatCurrency } from "@/lib/bowling/validation";

const heroHighlights = [
  "Christmas in July",
  "Team Sponsor",
  "Lane Sponsor",
  "Backpacks",
  "School Supplies",
];

type BowlingHeroProps = {
  registrations?: BowlingRegistrationRecord[];
};

export function BowlingHero({ registrations }: BowlingHeroProps) {
  return (
    <header className="bg-bfb-navy text-bfb-ink">
      <EventPageNav tone="bowling" ctaHref="#registration" ctaLabel="Register" />

      <section className="relative overflow-hidden bg-bfb-navy">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#11132F_0%,#112F6D_54%,#11132F_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-bfb-green/70" />
        <div className="bfb-shell relative grid gap-10 py-12 sm:py-16 lg:min-h-[760px] lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,0.74fr)] lg:items-center lg:gap-16 lg:py-20">
          <div className="max-w-[720px]">
            <h1
              className="max-w-full font-heading font-black uppercase text-white"
              aria-label="Christmas in July: Bowling for Backpacks"
            >
              <span className="block whitespace-nowrap text-[clamp(1.75rem,8.2vw,5.25rem)] leading-[1]">
                Christmas in July
              </span>
              <span className="mt-3 block whitespace-nowrap text-[clamp(1.15rem,5.8vw,3.75rem)] leading-[1.02] text-bfb-green">
                Bowling for Backpacks
              </span>
            </h1>
            <p className="mt-5 max-w-3xl font-heading text-xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {bowlingCopy.hero.headline}
            </p>
            <p className="mt-6 max-w-[650px] text-base font-medium leading-7 text-white/90 sm:text-xl sm:leading-8">
              {bowlingCopy.hero.body}
            </p>

            <HeroThermometer registrations={registrations} />
            <HeroSponsorshipProgress registrations={registrations} />

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#registration"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-white px-5 py-3 font-heading text-sm font-bold uppercase text-bfb-navy shadow-sm transition hover:bg-bfb-green hover:text-bfb-ink focus-visible:outline-bfb-green"
              >
                Register a Team
                <ArrowRight aria-hidden="true" size={17} />
              </a>
              <a
                href="#sponsorships"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border border-white/30 bg-white/10 px-5 py-3 font-heading text-sm font-bold uppercase text-white transition hover:border-bfb-green hover:bg-white/20 focus-visible:outline-bfb-green"
              >
                Become a Sponsor
                <ArrowRight aria-hidden="true" size={17} />
              </a>
            </div>

            <div className="mt-8 grid max-w-[650px] gap-3 border-l-2 border-bfb-green/70 pl-4 text-sm font-semibold text-white/90 sm:grid-cols-2">
              <span className="flex items-center gap-2">
                <Gift aria-hidden="true" className="text-bfb-green" size={18} />
                {bowlingEventConfig.theme}
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays aria-hidden="true" className="text-bfb-blue" size={18} />
                {bowlingEventConfig.date}
              </span>
              <span className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="text-bfb-blue" size={18} />
                {bowlingEventConfig.venue} / {bowlingEventConfig.city}
              </span>
            </div>
          </div>

          <HeroScene />
        </div>
      </section>
    </header>
  );
}

function HeroThermometer({ registrations }: BowlingHeroProps) {
  const sponsorshipSummary = buildBowlingSponsorshipSummary(registrations);
  const sponsorshipRaised = sponsorshipSummary.totalRaised;
  const progress = sponsorshipSummary.progress;
  const thermometerFill = Math.max(6, progress);
  const remainingToGoal = sponsorshipSummary.remainingToGoal;
  const tickMarks = [
    { label: formatCurrency(bowlingEventConfig.fundraisingGoal), top: "0%" },
    { label: formatCurrency(bowlingEventConfig.fundraisingGoal / 2), top: "50%" },
    { label: "$0", top: "100%" },
  ];

  return (
    <aside
      className="mt-7 max-w-[650px] rounded-sm border border-white/15 bg-white/10 p-4 text-white shadow-soft backdrop-blur sm:p-5"
      aria-label={`${progress}% of the Christmas in July sponsorship goal funded`}
    >
      <div className="grid grid-cols-[auto_1fr] items-center gap-4 sm:gap-5">
        <div className="relative h-36 w-20 shrink-0 sm:h-40 sm:w-36">
          <div className="absolute bottom-7 left-1/2 h-[6.5rem] w-10 -translate-x-1/2 rounded-full border border-white/45 bg-white/20 p-1 shadow-inner sm:h-[7.5rem] sm:w-11">
            <div className="relative h-full overflow-hidden rounded-full bg-white/35">
              <span
                className="bfb-thermometer-fill absolute bottom-0 left-0 right-0 rounded-full bg-[linear-gradient(180deg,#ff6b5f_0%,#e43f35_56%,#b72424_100%)]"
                style={{ height: `${thermometerFill}%` }}
              />
              <span className="pointer-events-none absolute inset-y-2 left-2 w-2 rounded-full bg-white/50 blur-[1px]" />
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border border-white/45 bg-white/20 p-1.5 shadow-sm">
            <div className="bfb-thermometer-bulb-fill h-full w-full rounded-full bg-[radial-gradient(circle_at_34%_30%,#ffd2cd_0%,#ff6b5f_24%,#e43f35_60%,#a91f1f_100%)] shadow-[0_0_18px_rgba(228,63,53,0.28)]" />
            <span className="pointer-events-none absolute left-5 top-4 h-3 w-3 rounded-full bg-white/55 blur-[1px]" />
          </div>

          <div className="absolute bottom-8 left-[calc(50%+1.45rem)] top-2 hidden w-16 sm:block">
            {tickMarks.map((tick) => (
              <span
                key={tick.label}
                className="absolute left-0 flex items-center gap-2"
                style={{ top: tick.top }}
              >
                <span className="h-px w-4 bg-white/45" />
                <span className="-translate-y-1/2 font-heading text-[0.62rem] font-black uppercase text-white/58">
                  {tick.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-heading text-xs font-black uppercase text-bfb-green">
              Help reach the goal
            </p>
            <p className="font-heading text-xs font-black uppercase text-white/80">
              {formatCurrency(bowlingEventConfig.fundraisingGoal)} goal
            </p>
          </div>
          <p className="mt-2 whitespace-nowrap font-heading text-[1.65rem] font-black uppercase leading-none text-white sm:text-4xl">
            {formatCurrency(sponsorshipRaised)} raised
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-white/80">
            Confirmed sponsorships and committed registrations move this meter
            toward backpacks and school-year support.
          </p>
          <div className="mt-4">
            <div className="flex justify-between gap-4 text-xs font-bold uppercase text-white/70">
              <span>{progress}% funded</span>
              <span>{formatCurrency(remainingToGoal)} to go</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
              <span
                className="block h-full rounded-full bg-bfb-green"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function HeroSponsorshipProgress({ registrations }: BowlingHeroProps) {
  const sponsorshipSummary = buildBowlingSponsorshipSummary(registrations);
  const progressItems = [
    {
      id: "raised",
      label: "Raised",
      value: formatCurrency(sponsorshipSummary.totalRaised),
      detail: `${sponsorshipSummary.progress}% funded`,
      progress: sponsorshipSummary.progress,
    },
    {
      id: "lanes",
      label: "Sponsored lanes",
      value: sponsorshipSummary.sponsoredLanes.toString(),
      detail: `${sponsorshipSummary.sponsoredLanes}/${sponsorshipSummary.totalLanes} lanes confirmed`,
      progress:
        sponsorshipSummary.totalLanes > 0
          ? Math.min(
              100,
              Math.round(
                (sponsorshipSummary.sponsoredLanes / sponsorshipSummary.totalLanes) * 100,
              ),
            )
          : 0,
    },
    {
      id: "secured",
      label: "Secured sponsorships",
      value: sponsorshipSummary.securedSponsorships.toString(),
      detail: `${sponsorshipSummary.availableSponsorships} opportunities available`,
      progress:
        sponsorshipSummary.securedSponsorships + sponsorshipSummary.availableSponsorships > 0
          ? Math.round(
              (sponsorshipSummary.securedSponsorships /
                (sponsorshipSummary.securedSponsorships +
                  sponsorshipSummary.availableSponsorships)) *
                100,
            )
          : 0,
    },
  ];

  return (
    <div className="mt-4 max-w-[650px] rounded-sm border border-white/15 bg-white/[0.08] p-4 text-white shadow-soft backdrop-blur sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-heading text-xs font-black uppercase text-bfb-green">
            Sponsorship path
          </p>
          <h2 className="mt-2 font-heading text-xl font-black uppercase leading-tight text-white sm:text-2xl">
            Sponsorship momentum is building.
          </h2>
        </div>
        <a
          href="#sponsorships"
          className="inline-flex items-center gap-2 font-heading text-xs font-black uppercase text-white underline decoration-bfb-green decoration-2 underline-offset-4 transition hover:text-bfb-green"
        >
          View options
          <ArrowRight aria-hidden="true" size={14} />
        </a>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {progressItems.map((item) => (
          <div
            key={item.id}
            className="rounded-sm border border-white/12 bg-white/[0.08] p-3"
          >
            <p className="font-heading text-[0.68rem] font-black uppercase text-bfb-green">
              {item.label}
            </p>
            <p className="mt-2 font-heading text-base font-black uppercase leading-tight text-white">
              {item.value}
            </p>
            <p className="mt-2 text-xs font-semibold leading-5 text-white/62">
              {item.detail}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/18">
              <span
                className="block h-full rounded-full bg-bfb-green"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroScene() {
  return (
    <div className="relative min-h-[440px] overflow-hidden rounded-sm bg-bfb-ink shadow-soft sm:min-h-[500px]">
      <Image
        src={bowlingPhotos.hero.src}
        alt={bowlingPhotos.hero.alt}
        fill
        priority
        sizes="(min-width: 1024px) 42vw, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,47,0.02),rgba(17,19,47,0.58))]" />
      <div className="relative flex h-full min-h-[440px] flex-col justify-between p-4 sm:min-h-[500px] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="rounded-sm bg-bfb-navy p-5 text-white shadow-soft">
            <Snowflake aria-hidden="true" size={34} />
            <p className="mt-4 whitespace-nowrap font-heading text-sm font-black uppercase leading-tight">
              Christmas in July.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-sm bg-white px-4 py-3 font-heading text-sm font-black uppercase text-bfb-navy shadow-sm">
            <Sun aria-hidden="true" size={17} />
            Let&apos;s roll
          </div>
        </div>

        <div className="rounded-sm border-l-4 border-bfb-green bg-bfb-cream p-5 text-bfb-ink shadow-soft sm:p-6">
          <p className="flex items-center gap-2 whitespace-nowrap font-heading text-sm font-black uppercase text-bfb-navy">
            <Backpack aria-hidden="true" size={15} />
            Holiday joy, school-year hope
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {heroHighlights.map((item) => (
              <span
                key={item}
                className="whitespace-nowrap rounded-sm border border-bfb-ink/10 bg-white px-3 py-2 font-heading text-xs font-bold uppercase text-bfb-navy"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
