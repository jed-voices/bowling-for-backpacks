import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CalendarDays, Home, MapPin } from "lucide-react";
import { cityCenterEvents, upcomingInitiatives } from "@/lib/events/directory";

export const metadata: Metadata = {
  title: "Supporters | OK City Center Events",
  description:
    "Find City Center events, registration paths, sponsorship opportunities, and giving options.",
};

export default function SupportersPage() {
  return (
    <main className="min-h-screen bg-cc-light-blue/45 font-body text-cc-dark-blue">
      <header className="section-shell py-5">
        <nav className="flex items-center justify-between gap-4 border-b border-cc-navy/10 pb-4 text-sm text-cc-navy/70">
          <Link href="/" className="inline-flex items-center gap-2 transition hover:text-cc-dark-blue">
            <Home aria-hidden="true" size={15} />
            City Center Events
          </Link>
          <Link href="/development" className="transition hover:text-cc-dark-blue">
            Development
          </Link>
        </nav>
      </header>

      <section className="section-shell pb-12 pt-6 sm:pb-16 sm:pt-10">
        <div className="max-w-3xl">
          <p className="cc-eyebrow">Supporter gateway</p>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.05] text-cc-dark-blue sm:text-5xl lg:text-6xl">
            Choose the event you are here to support.
          </h1>
          <p className="cc-copy mt-5">
            Each event has its own registration path. Start with the event, then
            choose tickets, teams, sponsorships, or gifts from there.
          </p>
        </div>
      </section>

      <section className="section-shell pb-16 sm:pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {cityCenterEvents.map((event) => (
            <article
              key={event.id}
              className="cc-card grid min-h-full overflow-hidden md:grid-cols-[0.78fr_1fr]"
            >
              <div className="relative min-h-64 md:min-h-full">
                <Image
                  src={event.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-6">
                <p className="cc-eyebrow">{event.label}</p>
                <h2 className="mt-3 font-heading text-2xl font-bold leading-tight text-cc-dark-blue sm:text-3xl">
                  {event.name}
                </h2>
                <p className="mt-4 text-base leading-7 text-cc-dark-blue/70">
                  {event.summary}
                </p>
                <div className="mt-6 grid gap-3 text-sm leading-6 text-cc-dark-blue/70">
                  <p className="flex gap-2">
                    <CalendarDays aria-hidden="true" className="mt-0.5 text-cc-navy" size={17} />
                    {event.date}
                  </p>
                  <p className="flex gap-2">
                    <MapPin aria-hidden="true" className="mt-0.5 text-cc-sky-blue" size={17} />
                    {event.venue}, {event.city}
                  </p>
                </div>
                <div className="mt-auto pt-7">
                  <Link href={event.href} className="cc-secondary">
                    {event.primaryAction}
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-cc-navy/10 bg-white py-16 sm:py-20">
        <div className="section-shell">
          <div className="max-w-3xl">
            <p className="cc-eyebrow">2026 initiatives</p>
            <h2 className="cc-heading mt-3">
              Upcoming moments to keep on your radar.
            </h2>
            <p className="cc-copy mt-4">
              City Center is building the year with clear entry points for
              teams, sponsors, donors, and long-term partners.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {upcomingInitiatives.map((initiative) => (
              <article
                key={initiative.name}
                className="flex min-h-52 flex-col rounded-sm border border-cc-navy/10 bg-cc-light-blue/25 p-5"
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
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
