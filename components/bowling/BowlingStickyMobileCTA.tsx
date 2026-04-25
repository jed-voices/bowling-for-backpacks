import { ArrowRight, Gift } from "lucide-react";

export function BowlingStickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/20 bg-bfb-navy/95 px-4 py-3 shadow-soft backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <a
          href="#registration"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-white px-4 py-3 font-heading text-xs font-black uppercase tracking-wide text-bfb-navy transition hover:bg-bfb-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Register
          <ArrowRight aria-hidden="true" size={16} />
        </a>
        <a
          href="#sponsorships"
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-sm border border-white/25 bg-white/10 px-4 py-3 font-heading text-xs font-black uppercase tracking-wide text-white transition hover:border-bfb-green hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Sponsor
          <Gift aria-hidden="true" size={15} />
        </a>
      </div>
    </div>
  );
}
