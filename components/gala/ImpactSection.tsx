import { BadgeCheck, HandHeart, Sparkles, UsersRound } from "lucide-react";
import { galaCopy } from "@/lib/gala/copy";

const icons = [HandHeart, UsersRound, BadgeCheck, Sparkles];

export function ImpactSection() {
  return (
    <section className="bg-sftc-stone py-20 sm:py-24" aria-labelledby="impact-heading">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">{galaCopy.impact.eyebrow}</p>
          <h2 id="impact-heading" className="section-heading mt-4">
            {galaCopy.impact.headline}
          </h2>
          <p className="body-copy mt-5">{galaCopy.impact.intro}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galaCopy.impact.cards.map((card, index) => {
            const Icon = icons[index];

            return (
              <article key={card.title} className="rounded-sm bg-white p-6 shadow-sm">
                <Icon aria-hidden="true" className="text-sftc-brass" size={26} />
                <h3 className="mt-8 font-heading text-xl font-semibold text-sftc-ink">
                  {card.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-sftc-ink/70">{card.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
