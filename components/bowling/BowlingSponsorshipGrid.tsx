import { ArrowRight, Check, Trophy } from "lucide-react";
import { bowlingSponsorships } from "@/lib/bowling/config";
import { formatCurrency } from "@/lib/bowling/validation";

export function BowlingSponsorshipGrid() {
  return (
    <section id="sponsorships" className="bg-white py-16 sm:py-20" aria-labelledby="bowling-sponsors">
      <div className="bfb-shell">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div>
            <p className="bfb-eyebrow">Sponsorships</p>
            <h2 id="bowling-sponsors" className="bfb-heading mt-4">
              Three clear ways to step in.
            </h2>
          </div>
          <p className="bfb-copy">
            The Event Sponsor is the primary opportunity. Team Sponsor / Team
            Registration and Lane Sponsor create simple entry points for groups
            that want to participate at a focused level.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {bowlingSponsorships.map((sponsor) => (
            <article
              key={sponsor.id}
              className={`flex min-h-full flex-col rounded-sm border p-6 ${
                sponsor.featured
                  ? "border-bfb-navy bg-bfb-navy text-white"
                  : "border-bfb-ink/10 bg-bfb-cream text-bfb-ink"
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
                {sponsor.featured
                  ? `${sponsor.name} - ${formatCurrency(sponsor.price)}`
                  : sponsor.name}
              </h3>
              {!sponsor.featured ? (
                <p className="mt-3 font-heading text-2xl font-black text-bfb-navy">
                  {formatCurrency(sponsor.price)}
                </p>
              ) : null}
              <p
                className={`mt-4 text-sm leading-6 ${
                  sponsor.featured ? "text-white/75" : "text-bfb-ink/70"
                }`}
              >
                {sponsor.description}
              </p>
              <ul className="mt-5 space-y-3">
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
                Select
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
