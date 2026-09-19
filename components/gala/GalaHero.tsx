import Image from "next/image";
import { ArrowRight, CalendarDays, HeartHandshake } from "lucide-react";
import { EventPageNav } from "@/components/events/EventPageNav";
import { eventConfig } from "@/lib/gala/config";
import { galaCopy } from "@/lib/gala/copy";
import { galaPhotos } from "@/lib/gala/photos";

export function GalaHero() {
  return (
    <header className="bg-sftc-evening text-white">
      <EventPageNav tone="gala" ctaHref={eventConfig.registrationUrl} ctaLabel="Register" />

      <div className="border-b border-white/15 bg-sftc-ink px-5 py-3 text-center font-heading text-xs font-semibold uppercase text-white/80 sm:text-sm">
        {galaCopy.announcement}
      </div>

      <section className="relative min-h-[72svh] overflow-hidden">
        <Image
          src={galaPhotos.hero.src}
          alt={galaPhotos.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: galaPhotos.hero.position }}
        />
        {/* Phones read the copy over the full width, so the scrim is even there.
            From lg up it falls away to the right to let the room show. */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            backgroundImage:
              "linear-gradient(0deg, rgb(var(--sftc-evening) / 0.95) 0%, rgb(var(--sftc-evening) / 0.9) 60%, rgb(var(--sftc-evening) / 0.8) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgb(var(--sftc-evening) / 0.97) 0%, rgb(var(--sftc-evening) / 0.92) 38%, rgb(var(--sftc-evening) / 0.66) 70%, rgb(var(--sftc-evening) / 0.5) 100%), linear-gradient(0deg, rgb(var(--sftc-evening) / 0.75) 0%, rgb(var(--sftc-evening) / 0) 45%)",
          }}
        />

        <div className="section-shell relative z-10 grid min-h-[62svh] items-center py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.62fr)] lg:gap-10">
          <div className="max-w-3xl">
            <p className="eyebrow text-sftc-gold">{galaCopy.hero.eyebrow}</p>
            <p className="script-accent mt-6 text-5xl text-sftc-gold sm:text-6xl lg:text-7xl">
              Welcome
            </p>
            <h1 className="mt-2 max-w-4xl font-display text-4xl font-medium leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              {galaCopy.hero.headline}
            </h1>
            <p className="invite-label mt-4 text-xs text-white/70 sm:text-sm">
              {galaCopy.hero.theme}
            </p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              {galaCopy.hero.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={eventConfig.registrationUrl} className="button-primary">
                Register or Host a Table
                <ArrowRight aria-hidden="true" size={17} />
              </a>
              <a href="#sponsorships" className="button-secondary">
                See Options
              </a>
            </div>
            <div className="mt-8 flex max-w-2xl flex-col gap-3 border-l-2 border-sftc-hope pl-4 text-sm text-white/80 sm:flex-row sm:items-center sm:gap-6">
              <span className="inline-flex items-center gap-2">
                <CalendarDays aria-hidden="true" size={17} />
                {eventConfig.date} / {eventConfig.doorsTime}
              </span>
              <span className="inline-flex items-center gap-2">
                <HeartHandshake aria-hidden="true" size={17} />
                {galaCopy.hero.detailLine}
              </span>
            </div>
          </div>

          <div className="pointer-events-none relative hidden h-[520px] items-center justify-end lg:flex">
            <Image
              src={galaPhotos.heroSupport.src}
              alt={galaPhotos.heroSupport.alt}
              width={512}
              height={680}
              sizes="340px"
              className="h-[440px] w-[340px] rounded-sm object-cover shadow-soft ring-1 ring-sftc-gold/35"
              style={{ objectPosition: galaPhotos.heroSupport.position }}
            />
          </div>
        </div>
      </section>
    </header>
  );
}
