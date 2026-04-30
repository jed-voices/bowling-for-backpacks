import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  Gift,
  Home,
  LockKeyhole,
  UsersRound,
} from "lucide-react";
import { cityCenterEvents, upcomingInitiatives } from "@/lib/events/directory";

export const metadata: Metadata = {
  title: "OK City Center Events",
  description:
    "The City Center events gateway for supporters, families, sponsors, and development access.",
};

export default function HomePage() {
  const featuredEvent = cityCenterEvents[0];

  return (
    <main className="min-h-screen bg-cc-light-blue/45 font-body text-cc-dark-blue">
      <section className="relative overflow-hidden bg-sftc-evening text-white">
        <Image
          src={featuredEvent.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="pointer-events-none object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,18,48,0.94),rgba(33,52,104,0.74),rgba(22,34,46,0.46))]" />

        <div className="section-shell relative pt-5">
          <nav className="flex flex-col gap-4 border-b border-white/10 pb-4 text-sm font-semibold uppercase text-white/75 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="font-heading font-semibold text-white transition hover:text-sftc-hope">
              CITY CENTER EVENTS
            </Link>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
              <Link
                href="https://okcitycenter.org/"
                className="inline-flex items-center gap-1.5 transition hover:text-white"
              >
                <Home aria-hidden="true" size={14} />
                CITY CENTER HOME
              </Link>
              <Link href="/supporters" className="inline-flex items-center gap-1.5 transition hover:text-white">
                <UsersRound aria-hidden="true" size={14} />
                SUPPORTERS
              </Link>
              <Link
                href="/development"
                className="inline-flex items-center gap-1.5 transition hover:text-white"
              >
                <LockKeyhole aria-hidden="true" size={14} />
                DASHBOARD
              </Link>
            </div>
          </nav>
        </div>

        <div className="section-shell relative grid min-h-[calc(100svh-70px)] items-center gap-8 py-10 sm:gap-10 sm:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.56fr)] lg:py-20">
          <div>
            <p className="font-heading text-xs font-semibold uppercase text-sftc-hope">
              OKCityCenterEvents.org
            </p>
            <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-[1.04] text-white sm:text-6xl lg:text-7xl">
              One front door for City Center events.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/80 sm:mt-6 sm:text-xl sm:leading-8">
              Supporters can find the right event and register. City Center
              development can sign in through a separate path when the work
              calls for it.
            </p>

            <div className="mt-7 flex flex-col gap-4 sm:mt-9 sm:flex-row sm:items-center">
              <Link
                href="/supporters"
                className="inline-flex items-center gap-2 font-heading text-base font-semibold text-white underline decoration-sftc-hope decoration-2 underline-offset-8 transition hover:text-sftc-hope"
              >
                View supporter events
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <Link
                href="/development"
                className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
              >
                <LockKeyhole aria-hidden="true" size={15} />
                Development access
              </Link>
            </div>
          </div>

          <aside className="border border-white/20 bg-white/10 p-5 shadow-soft backdrop-blur sm:p-6">
            <p className="font-heading text-xs font-semibold uppercase text-sftc-hope">
              Now registering
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
              {featuredEvent.name}
            </h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              {featuredEvent.summary}
            </p>
            <dl className="mt-6 grid gap-4 border-y border-white/20 py-5 text-sm text-white/75">
              <div className="flex gap-3">
                <CalendarDays aria-hidden="true" className="text-sftc-hope" size={19} />
                <div>
                  <dt className="sr-only">Date</dt>
                  <dd>{featuredEvent.date}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <Gift aria-hidden="true" className="text-sftc-gold" size={19} />
                <div>
                  <dt className="sr-only">Event type</dt>
                  <dd>{featuredEvent.label}</dd>
                </div>
              </div>
            </dl>
            <Link
              href={featuredEvent.href}
              className="mt-6 inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase text-white underline decoration-sftc-hope decoration-2 underline-offset-8 transition hover:text-sftc-hope"
            >
              {featuredEvent.primaryAction}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </aside>
        </div>
      </section>

      <section className="section-shell py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <p className="cc-eyebrow">Two clear paths</p>
            <h2 className="cc-heading mt-3">
              The public path stays focused on people.
            </h2>
            <p className="cc-copy mt-4">
              Families, sponsors, and partners should see the event story
              first. City Center access stays separate so the community experience
              remains simple.
            </p>
          </div>

          <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
            <GatewayPanel
              icon={<UsersRound aria-hidden="true" size={22} />}
              title="Supporter view"
              copy="Browse active events, choose how to participate, and complete registration without internal tools in the way."
              href="/supporters"
              action="Open supporter gateway"
            />
            <GatewayPanel
              icon={<LockKeyhole aria-hidden="true" size={22} />}
              title="Development view"
              copy="A private sign-in for City Center team members when they need the internal event desk."
              href="/development"
              action="Development access"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-cc-navy/10 bg-white py-16 sm:py-20">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <div>
              <p className="cc-eyebrow">2026 initiatives</p>
              <h2 className="cc-heading mt-3">
                A clearer view of what is ahead.
              </h2>
            </div>
            <p className="cc-copy">
              Sponsors and donors should be able to see the year taking shape,
              not only the event currently open for registration.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {upcomingInitiatives.map((initiative) => (
              <article
                key={initiative.name}
                className="flex min-h-56 flex-col rounded-sm border border-cc-navy/10 bg-cc-light-blue/25 p-5"
              >
                <p className="font-heading text-xs font-bold uppercase text-cc-sky-blue">
                  {initiative.timing}
                </p>
                <h3 className="mt-4 font-heading text-xl font-bold leading-tight text-cc-dark-blue">
                  {initiative.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-cc-dark-blue/65">
                  {initiative.focus}
                </p>
                <p className="mt-auto pt-5 font-heading text-xs font-bold uppercase text-cc-navy/45">
                  {initiative.status}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function GatewayPanel({
  icon,
  title,
  copy,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  copy: string;
  href: string;
  action: string;
}) {
  return (
    <article className="cc-card p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-cc-light-blue text-cc-navy">
        {icon}
      </div>
      <h3 className="mt-5 font-heading text-2xl font-bold text-cc-dark-blue">
        {title}
      </h3>
      <p className="mt-3 text-base leading-7 text-cc-dark-blue/70">{copy}</p>
      <Link
        href={href}
        className="cc-secondary mt-6"
      >
        {action}
        <ArrowRight aria-hidden="true" size={16} />
      </Link>
    </article>
  );
}
