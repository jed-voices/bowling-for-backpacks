import { Check, Trophy } from "lucide-react";
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
              Help make Christmas-in-July generosity possible.
            </h2>
          </div>
          <p className="bfb-copy">
            Sponsorships help cover the event and provide direct support for students
            and families preparing for the school year. The theme is playful and easy
            to join, but the purpose is practical and deeply human.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {bowlingSponsorships.map((sponsor) => (
            <article
              key={sponsor.id}
              className="rounded-sm border border-bfb-ink/10 bg-bfb-cream p-5"
            >
              <Trophy aria-hidden="true" className="text-bfb-green" size={24} />
              <h3 className="mt-5 min-h-16 font-heading text-xl font-black leading-tight text-bfb-ink">
                {sponsor.name}
              </h3>
              <p className="mt-3 font-heading text-2xl font-black text-bfb-navy">
                {formatCurrency(sponsor.price)}
              </p>
              <p className="mt-4 text-sm leading-6 text-bfb-ink/70">{sponsor.description}</p>
              <ul className="mt-5 space-y-3">
                {sponsor.benefits.slice(0, 4).map((benefit) => (
                  <li key={benefit} className="flex gap-2 text-sm leading-5 text-bfb-ink/70">
                    <Check aria-hidden="true" className="mt-0.5 shrink-0 text-bfb-green" size={16} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
