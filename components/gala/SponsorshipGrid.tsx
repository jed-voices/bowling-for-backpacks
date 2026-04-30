import { ArrowRight, Check } from "lucide-react";
import { sponsorships } from "@/lib/gala/config";
import { galaCopy } from "@/lib/gala/copy";
import { formatCurrency } from "@/lib/gala/validation";

export function SponsorshipGrid() {
  return (
    <section id="sponsorships" className="bg-sftc-ivory py-20 sm:py-24" aria-labelledby="sponsorship-heading">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow">{galaCopy.sponsorships.eyebrow}</p>
            <h2 id="sponsorship-heading" className="section-heading mt-4">
              {galaCopy.sponsorships.headline}
            </h2>
          </div>
          <div className="space-y-4 text-base leading-7 text-sftc-ink/70">
            {galaCopy.sponsorships.body.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {sponsorships.map((tier) => (
            <article
              key={tier.id}
              className="flex min-h-full flex-col rounded-sm border border-sftc-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sftc-brass/45 hover:shadow-md"
            >
              <p className="font-heading text-xs font-semibold uppercase text-sftc-brass">
                {tier.label}
              </p>
              <h3 className="mt-3 min-h-14 font-heading text-xl font-semibold leading-tight text-sftc-ink">
                {tier.name}
              </h3>
              <p className="mt-3 text-3xl font-semibold text-sftc-ink">
                {formatCurrency(tier.price)}
              </p>
              <p className="mt-1 text-sm font-semibold text-sftc-ink/60">
                {tier.seats} seats
              </p>
              <p className="mt-5 text-sm leading-6 text-sftc-ink/70">{tier.description}</p>
              <ul className="mt-6 space-y-3 pb-6">
                {tier.benefits?.slice(0, 4).map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-sm leading-5 text-sftc-ink/70">
                    <Check aria-hidden="true" className="mt-0.5 shrink-0 text-sftc-hope" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a href="#registration" className="button-quiet mt-auto justify-between">
                Reserve This Level
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
