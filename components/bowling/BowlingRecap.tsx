import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { bowlingRecap } from "@/lib/bowling/copy";

export function BowlingRecap() {
  return (
    <section id="recap" className="bg-bfb-cream py-16 sm:py-20" aria-labelledby="recap-heading">
      <div className="bfb-shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="bfb-eyebrow text-bfb-blue">{bowlingRecap.eyebrow}</p>
          <h2
            id="recap-heading"
            className="mt-4 font-heading text-3xl font-black leading-tight text-bfb-navy sm:text-4xl"
          >
            {bowlingRecap.headline}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-bfb-navy/75 sm:text-lg sm:leading-8">
            {bowlingRecap.body}
          </p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-bfb-navy/75">
            {bowlingRecap.closingNote}
          </p>

          <div className="mt-8 rounded-sm border border-bfb-navy/12 bg-white p-5">
            <p className="bfb-eyebrow text-bfb-blue">{bowlingRecap.nextEvent.label}</p>
            <p className="mt-3 text-base leading-7 text-bfb-navy/80">
              {bowlingRecap.nextEvent.body}
            </p>
            <Link
              href={bowlingRecap.nextEvent.href}
              className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-sm bg-bfb-navy px-5 py-3 font-heading text-sm font-bold uppercase text-white transition hover:bg-bfb-blue"
            >
              {bowlingRecap.nextEvent.cta}
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
        </div>

        <div className="rounded-sm border border-bfb-navy/12 bg-white p-6 shadow-sm">
          <h3 className="font-heading text-xl font-black text-bfb-navy">
            {bowlingRecap.creditsHeadline}
          </h3>
          <ul className="mt-6 space-y-5">
            {bowlingRecap.credits.map((credit) => (
              <li key={credit.name} className="flex gap-3">
                <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-bfb-green" size={18} />
                <div>
                  <p className="font-heading text-xs font-bold uppercase text-bfb-navy/55">
                    {credit.label}
                  </p>
                  <p className="mt-1 text-base font-semibold text-bfb-navy">{credit.name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
