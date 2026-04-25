import { ArrowRight, Heart } from "lucide-react";

export function FooterCTA() {
  return (
    <footer className="bg-sftc-ink text-white">
      <section className="section-shell grid gap-8 py-16 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="eyebrow text-sftc-gold">Cannot attend?</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight sm:text-5xl">
            Your gift can still help carry the work.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Every gift supports City Center&apos;s movement of hope, fueled by love at
            the center of our city.
          </p>
        </div>
        <a href="#registration" className="button-primary">
          Add a Gift
          <Heart aria-hidden="true" size={17} />
        </a>
      </section>
      <div className="border-t border-white/12 py-6">
        <div className="section-shell flex flex-col gap-3 text-sm text-white/56 sm:flex-row sm:items-center sm:justify-between">
          <p>City Center / Stories From the Center / Fall 2026</p>
          <a href="#top" className="inline-flex items-center gap-2 text-white hover:text-sftc-gold">
            Back to top
            <ArrowRight aria-hidden="true" size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
