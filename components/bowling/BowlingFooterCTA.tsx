import { ArrowRight, Gift, Heart, Trophy, UsersRound } from "lucide-react";
import { bowlingEventConfig } from "@/lib/bowling/config";

export function BowlingFooterCTA() {
  return (
    <footer className="bg-bfb-ink text-white">
      <section className="bfb-shell grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="bfb-eyebrow text-white">Can&apos;t bowl?</p>
          <h2 className="mt-4 font-heading text-3xl font-black leading-tight sm:text-5xl">
            Give a Christmas in July gift anyway.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Help provide backpacks, school supplies, and practical support for
            students and families in Oklahoma City.
          </p>
        </div>
        <a href="#registration" className="bfb-primary bg-bfb-green text-bfb-ink hover:bg-bfb-blue">
          Make a Gift
          <Heart aria-hidden="true" size={17} />
        </a>
      </section>

      <section className="border-t border-white/15 py-10" aria-labelledby="bowling-next-step">
        <div className="bfb-shell">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="bfb-eyebrow text-white">Choose your part</p>
              <h2
                id="bowling-next-step"
                className="mt-4 font-heading text-3xl font-black leading-tight sm:text-4xl"
              >
                Every lane, team, and gift helps students begin with support.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                City Center is inviting companies, churches, families, and
                neighbors to step in together. Pick the path that fits, and we
                will help make the next step clear.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <NextStep
                icon={<Trophy aria-hidden="true" size={21} />}
                label="Sponsor"
                copy="Lead the effort with event, team, or lane sponsorship."
              />
              <NextStep
                icon={<UsersRound aria-hidden="true" size={21} />}
                label="Bowl"
                copy="Bring a team and turn the evening into shared support."
              />
              <NextStep
                icon={<Gift aria-hidden="true" size={21} />}
                label="Give"
                copy="Make a gift that helps provide backpacks and supplies."
              />
              <a
                href="#registration"
                className="bfb-secondary border-white/30 bg-white/[0.08] text-white hover:bg-white/[0.14] sm:col-span-3"
              >
                Start Registration
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/15 py-6">
        <div className="bfb-shell text-sm text-white/55">
          City Center / {bowlingEventConfig.name} / July 16, 2026
        </div>
      </div>
    </footer>
  );
}

function NextStep({
  icon,
  label,
  copy,
}: {
  icon: React.ReactNode;
  label: string;
  copy: string;
}) {
  return (
    <div className="rounded-sm border border-white/15 bg-white/[0.07] p-4">
      <div className="text-bfb-green">{icon}</div>
      <p className="mt-4 font-heading text-lg font-black text-white">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{copy}</p>
    </div>
  );
}
