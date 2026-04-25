import { ArrowRight, Gift, HandHeart, Trophy, UsersRound } from "lucide-react";
import { bowlingRegistrationOptions } from "@/lib/bowling/config";
import { bowlingCopy } from "@/lib/bowling/copy";
import { formatCurrency } from "@/lib/bowling/validation";

const icons = {
  team: UsersRound,
  sponsorship: Trophy,
  "lane-sponsor": HandHeart,
  gift: Gift,
};

export function BowlingRegistrationOptions() {
  return (
    <section className="bg-bfb-light py-16 sm:py-20" aria-labelledby="bowling-options">
      <div className="bfb-shell">
        <div className="max-w-3xl">
          <p className="bfb-eyebrow">Registration options</p>
          <h2 id="bowling-options" className="bfb-heading mt-4">
            {bowlingCopy.registration.headline}
          </h2>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {bowlingRegistrationOptions.map((option) => {
            const Icon = icons[option.id];

            return (
              <article key={option.id} className="flex flex-col rounded-sm bg-white p-6 shadow-sm">
                <Icon aria-hidden="true" className="text-bfb-blue" size={28} />
                <h3 className="mt-6 font-heading text-2xl font-black leading-tight text-bfb-ink">
                  {option.name}
                </h3>
                <p className="mt-3 font-heading text-xl font-black text-bfb-navy">
                  {option.price > 0 ? formatCurrency(option.price) : "Any amount"}
                </p>
                <p className="mt-4 min-h-28 text-base leading-7 text-bfb-ink/70">
                  {option.description}
                </p>
                <a href="#registration" className="bfb-secondary mt-auto justify-between">
                  Choose
                  <ArrowRight aria-hidden="true" size={16} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
