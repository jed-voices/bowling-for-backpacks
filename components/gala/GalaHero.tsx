import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, HeartHandshake } from "lucide-react";
import { galaCopy } from "@/lib/gala/copy";
import { galaPhotos } from "@/lib/gala/photos";

export function GalaHero() {
  return (
    <header className="bg-sftc-evening text-white">
      <div className="border-b border-white/15 bg-sftc-ink px-5 py-3 text-center font-heading text-xs font-semibold uppercase text-white/80 sm:text-sm">
        {galaCopy.announcement}
      </div>

      <section className="relative min-h-[86svh] overflow-hidden">
        <Image
          src={galaPhotos.hero.src}
          alt={galaPhotos.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,27,61,0.92)_0%,rgba(13,27,61,0.76)_42%,rgba(13,27,61,0.28)_100%)]" />

        <nav className="section-shell relative z-10 flex items-center justify-between py-5 font-heading text-sm font-semibold">
          <Link href="/" className="text-white transition hover:text-sftc-gold">
            City Center
          </Link>
          <a href="#registration" className="button-secondary hidden sm:inline-flex">
            Reserve Your Place
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </nav>

        <div className="section-shell relative z-10 grid min-h-[72svh] items-center py-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.62fr)] lg:gap-10">
          <div className="max-w-3xl">
            <p className="eyebrow text-sftc-gold">{galaCopy.hero.eyebrow}</p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-medium leading-[1.02] text-white sm:text-6xl lg:text-7xl">
              {galaCopy.hero.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
              {galaCopy.hero.body}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#registration" className="button-primary">
                Reserve Your Place
                <ArrowRight aria-hidden="true" size={17} />
              </a>
              <a href="#sponsorships" className="button-secondary">
                View Sponsorships
              </a>
            </div>
            <div className="mt-8 flex max-w-2xl flex-col gap-3 border-l-2 border-sftc-hope pl-4 text-sm text-white/80 sm:flex-row sm:items-center sm:gap-6">
              <span className="inline-flex items-center gap-2">
                <CalendarDays aria-hidden="true" size={17} />
                Fall 2026 / Oklahoma City
              </span>
              <span className="inline-flex items-center gap-2">
                <HeartHandshake aria-hidden="true" size={17} />
                {galaCopy.hero.detailLine}
              </span>
            </div>
          </div>

          <div className="pointer-events-none relative hidden h-[520px] lg:block">
            <Image
              src={galaPhotos.heroSupport.src}
              alt={galaPhotos.heroSupport.alt}
              width={512}
              height={640}
              sizes="256px"
              className="absolute right-0 top-10 h-80 w-64 rounded-sm object-cover shadow-soft"
            />
            <Image
              src={galaPhotos.detail.src}
              alt={galaPhotos.detail.alt}
              width={448}
              height={576}
              sizes="224px"
              className="absolute bottom-10 right-32 h-72 w-56 rounded-sm object-cover shadow-soft ring-8 ring-white/10"
            />
          </div>
        </div>
      </section>
    </header>
  );
}
