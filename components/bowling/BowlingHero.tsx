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
import { bowlingEventConfig } from "@/lib/bowling/config";
import { bowlingCopy } from "@/lib/bowling/copy";
import { bowlingPhotos } from "@/lib/bowling/photos";

const utilityLinks = [
  {
    label: "Donate Today!",
    href: "https://okcitycenter.org/?form=GIVE",
    tone: "bg-bfb-blue",
    text: "text-white",
  },
  {
    label: "Need Help?",
    href: "https://okcitycenter.org/need-help/",
    tone: "bg-bfb-navy",
    text: "text-white",
  },
  {
    label: "Contact Us",
    href: "https://okcitycenter.org/contact/",
    tone: "bg-bfb-green",
    text: "text-bfb-navy",
  },
  {
    label: "Book a Speaker",
    href: "https://okcitycenter.org/book-speaker/",
    tone: "bg-bfb-blue",
    text: "text-white",
  },
  {
    label: "Voices of OKC",
    href: "https://voicesofokc.com",
    tone: "bg-bfb-navy",
    text: "text-white",
  },
];

const contactDetails = [
  {
    icon: "location",
    label: "Location",
    value: "5731 NW 41st Warr Acres, OK 73122",
  },
  {
    icon: "phone",
    label: "Phone",
    value: "(405) 384 - 5670",
  },
  {
    icon: "mailbox",
    label: "PO Box",
    value: "42301 Oklahoma City OK 73123",
  },
];

const primaryNavItems = [
  { label: "Home", href: "https://okcitycenter.org/" },
  {
    label: "About",
    href: "https://okcitycenter.org/about/",
    children: [{ label: "Meet the Team", href: "https://okcitycenter.org/meet-the-team/" }],
  },
  {
    label: "Programs",
    href: "https://okcitycenter.org/programs/",
    children: [{ label: "Our Approach", href: "https://okcitycenter.org/our-approach/" }],
  },
  { label: "Events", href: "https://okcitycenter.org/events/" },
  {
    label: "Donate",
    href: "https://okcitycenter.org/donate/",
    children: [{ label: "Get Involved", href: "https://okcitycenter.org/get-involved/" }],
  },
  { label: "Contact", href: "https://okcitycenter.org/contact/" },
  {
    label: "Need Help",
    href: "https://okcitycenter.org/need-help/",
    children: [{ label: "Necesito ayuda", href: "https://okcitycenter.org/necesito-ayuda/" }],
  },
];

const heroHighlights = [
  "Christmas in July",
  "Team Sponsor",
  "Lane Sponsor",
  "Backpacks",
  "School Supplies",
];

export function BowlingHero() {
  return (
    <header className="bg-bfb-navy text-bfb-ink">
      <CityCenterSiteHeader />

      <section className="relative overflow-hidden bg-bfb-navy">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#11132F_0%,#112F6D_54%,#11132F_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-bfb-green/70" />
        <div className="bfb-shell relative grid gap-10 py-12 sm:py-16 lg:min-h-[760px] lg:grid-cols-[minmax(0,0.96fr)_minmax(420px,0.74fr)] lg:items-center lg:gap-16 lg:py-20">
          <div className="max-w-[720px]">
            <h1
              className="max-w-4xl font-heading font-black uppercase text-white"
              aria-label="Christmas in July Bowling for Backpacks"
            >
              <span className="block whitespace-nowrap text-[clamp(1.75rem,8.2vw,5.25rem)] leading-[1]">
                Christmas in July
              </span>
              <span className="mt-3 block whitespace-nowrap text-[clamp(1.35rem,6.4vw,3.75rem)] leading-[1.02] text-bfb-green">
                Bowling for Backpacks
              </span>
            </h1>
            <p className="mt-5 max-w-3xl font-heading text-xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {bowlingCopy.hero.headline}
            </p>
            <p className="mt-6 max-w-[650px] text-base font-medium leading-7 text-white/90 sm:text-xl sm:leading-8">
              {bowlingCopy.hero.body}
            </p>

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
                Event Sponsor - $5,000
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

function CityCenterSiteHeader() {
  return (
    <div className="relative z-20">
      <div className="grid font-heading text-sm font-semibold uppercase sm:grid-cols-5 xl:text-base">
        {utilityLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
              className={`${link.tone} ${link.text} flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-center leading-tight transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white`}
          >
            {link.label === "Voices of OKC" ? null : <UtilityArrowIcon />}
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      <div className="bg-white">
        <div className="grid gap-4 px-5 py-5 sm:px-8 md:grid-cols-3 lg:px-9 lg:py-6">
          {contactDetails.map((detail, index) => {
            const alignment = [
              "md:justify-start",
              "md:justify-center",
              "md:justify-end",
            ][index];

            return (
              <div
                key={detail.label}
                className={`flex min-w-0 items-center justify-center gap-3 text-center font-heading uppercase text-bfb-navy ${alignment}`}
              >
                <HeaderContactIcon type={detail.icon} />
                <p className="min-w-0 text-sm font-semibold leading-6 sm:text-base">
                  {detail.label}:{" "}
                  <span className="font-semibold text-bfb-navy/90">{detail.value}</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <nav
        aria-label="City Center navigation"
        className="relative overflow-visible bg-bfb-green text-bfb-navy"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),rgba(93,203,163,0)_36%,rgba(17,47,109,0.08))]" />
        <div className="relative z-10 mx-auto flex w-full max-w-[1220px] flex-row items-center justify-center gap-4 px-4 py-2 sm:px-8 lg:justify-start lg:gap-8">
          <a
            href="https://okcitycenter.org/"
            aria-label="City Center home"
            className="flex h-16 w-16 shrink-0 items-center justify-center transition hover:scale-[1.02] sm:h-20 sm:w-20 lg:h-[88px] lg:w-[88px]"
          >
            <Image
              src="/bowling/cij-cc-logo.svg"
              alt=""
              width={88}
              height={88}
              priority
              unoptimized
              className="h-full w-full object-contain drop-shadow-sm"
            />
          </a>

          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-start gap-x-4 gap-y-1 lg:flex-nowrap lg:gap-x-7">
            {primaryNavItems.map((item) => (
              <HeaderNavLink key={item.label} {...item} />
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}

function HeaderNavLink({
  label,
  href,
  children = [],
}: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}) {
  const hasMenu = children.length > 0;

  return (
    <div className="group relative py-2">
      <a
        href={href}
        className="flex min-h-8 items-center border-b-2 border-transparent font-heading text-xs font-semibold uppercase text-bfb-navy transition hover:border-bfb-navy focus-visible:border-bfb-navy sm:text-sm lg:min-h-9 lg:text-lg"
      >
        {label}
      </a>
      {hasMenu ? (
        <div className="absolute left-0 top-full z-40 hidden min-w-48 pt-1 group-hover:block group-focus-within:block">
          <div className="rounded-sm bg-white py-2 shadow-soft ring-1 ring-bfb-ink/10">
            {children.map((child) => (
              <a
                key={child.label}
                href={child.href}
                className="block whitespace-nowrap px-5 py-3 font-heading text-sm font-semibold uppercase text-bfb-navy transition hover:bg-bfb-light hover:text-bfb-blue focus-visible:bg-bfb-light focus-visible:text-bfb-blue"
              >
                {child.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function UtilityArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9" cy="9" r="8.5" fill="white" />
      <path
        d="M8.2 5.1 12.1 9l-3.9 3.9-1.25-1.25L8.7 9 6.95 6.35 8.2 5.1Z"
        fill="#112F6D"
      />
    </svg>
  );
}

function HeaderContactIcon({ type }: { type: string }) {
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-bfb-green">
      {type === "location" ? (
        <svg aria-hidden="true" viewBox="0 0 28 34" className="h-8 w-8" fill="currentColor">
          <path d="M14 0C6.8 0 1 5.8 1 13c0 9.7 13 21 13 21s13-11.3 13-21C27 5.8 21.2 0 14 0Zm0 18.1A5.2 5.2 0 1 1 14 7.7a5.2 5.2 0 0 1 0 10.4Z" />
        </svg>
      ) : null}
      {type === "phone" ? (
        <svg aria-hidden="true" viewBox="0 0 22 34" className="h-8 w-8" fill="currentColor">
          <path d="M17.2 0H4.8A4.8 4.8 0 0 0 0 4.8v24.4A4.8 4.8 0 0 0 4.8 34h12.4a4.8 4.8 0 0 0 4.8-4.8V4.8A4.8 4.8 0 0 0 17.2 0ZM11 31a2.1 2.1 0 1 1 0-4.2A2.1 2.1 0 0 1 11 31Zm6.4-7.2H4.6V5.2h12.8v18.6Z" />
        </svg>
      ) : null}
      {type === "mailbox" ? (
        <svg aria-hidden="true" viewBox="0 0 38 30" className="h-8 w-10" fill="currentColor">
          <path d="M0 30h8V6.5A6.5 6.5 0 0 0 1.5 0H0v30Zm4-23.2h2.4V11H4V6.8ZM11 30h8V6.5A6.5 6.5 0 0 0 12.5 0H11v30Zm4-23.2h2.4V11H15V6.8ZM23 30h15V9a9 9 0 0 0-9-9h-6v30Zm5-23.2h4.6V11H28V6.8Z" />
        </svg>
      ) : null}
    </span>
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
