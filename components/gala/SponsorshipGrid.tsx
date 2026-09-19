import { ArrowRight, Check, Mail } from "lucide-react";
import { eventConfig, publicGalaOptions } from "@/lib/gala/config";
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

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {publicGalaOptions.map((option) => (
            <article
              key={option.id}
              className="flex min-h-full flex-col rounded-sm border border-sftc-ink/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-sftc-brass/45 hover:shadow-md"
            >
              <p className="font-heading text-xs font-semibold uppercase text-sftc-brass">
                {option.label}
              </p>
              <h3 className="mt-3 font-heading text-xl font-semibold leading-tight text-sftc-ink">
                {option.name}
              </h3>
              <p className="mt-3 text-3xl font-semibold text-sftc-ink">
                {formatCurrency(option.price)}
              </p>
              <p className="mt-1 text-sm font-semibold text-sftc-ink/60">
                {option.seats} {option.seats === 1 ? "seat" : "seats"}
              </p>
              <p className="mt-5 text-sm leading-6 text-sftc-ink/70">{option.description}</p>
              <ul className="mt-6 space-y-3 pb-6">
                {option.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-sm leading-5 text-sftc-ink/70">
                    <Check aria-hidden="true" className="mt-0.5 shrink-0 text-sftc-brass" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <a href={eventConfig.registrationUrl} className="button-quiet mt-auto justify-between">
                Register on Greater Giving
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </article>
          ))}

          <article className="flex min-h-full flex-col rounded-sm border border-sftc-ink/10 bg-sftc-ink p-6 text-white shadow-sm">
            <p className="font-heading text-xs font-semibold uppercase text-sftc-gold">
              Presenting and Custom
            </p>
            <h3 className="mt-3 font-heading text-xl font-semibold leading-tight">
              Sponsor the evening
            </h3>
            <p className="mt-5 pb-6 text-sm leading-6 text-white/75">
              Presenting, underwriting, and custom sponsorships are arranged directly with
              City Center&apos;s development team so the recognition fits your goals.
            </p>
            <div className="mt-auto space-y-3 text-sm">
              <a
                href={`mailto:${eventConfig.contactEmail}?subject=${encodeURIComponent("2026 Gala sponsorship")}`}
                className="inline-flex items-center gap-2 font-semibold text-white underline decoration-sftc-gold underline-offset-4 hover:text-sftc-gold"
              >
                <Mail aria-hidden="true" size={16} />
                {eventConfig.contactEmail}
              </a>
              <p className="text-white/70">
                <a href={`tel:${eventConfig.contactPhone.replace(/\D/g, "")}`} className="hover:text-white">
                  {eventConfig.contactPhone}
                </a>
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
