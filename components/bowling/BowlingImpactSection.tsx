import { Backpack, HeartHandshake, Pencil, Sparkles } from "lucide-react";
import { bowlingCopy } from "@/lib/bowling/copy";

const icons = [Backpack, Pencil, HeartHandshake, Sparkles];

export function BowlingImpactSection() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="bowling-impact">
      <div className="bfb-shell">
        <div className="max-w-3xl">
          <p className="bfb-eyebrow">Back-to-school impact</p>
          <h2 id="bowling-impact" className="bfb-heading mt-4">
            {bowlingCopy.impact.headline}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {bowlingCopy.impact.cards.map((card, index) => {
            const Icon = icons[index];

            return (
              <article key={card.title} className="rounded-sm bg-bfb-cream p-6 shadow-sm">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-bfb-blue/15 text-bfb-navy">
                  <Icon aria-hidden="true" size={24} />
                </span>
                <h3 className="mt-7 font-heading text-xl font-black text-bfb-ink">
                  {card.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-bfb-ink/70">{card.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
