import Link from "next/link";
import { ArrowRight, Home, LockKeyhole, UsersRound } from "lucide-react";

type EventPageNavProps = {
  tone: "bowling" | "gala";
  ctaHref?: string;
  ctaLabel?: string;
};

const toneStyles = {
  bowling: {
    shell: "border-b border-bfb-navy/10 bg-bfb-cream/95 text-bfb-navy shadow-sm backdrop-blur",
    brand: "text-bfb-navy hover:text-bfb-blue",
    link: "text-bfb-navy/76 hover:text-bfb-navy",
    icon: "text-bfb-blue",
    cta: "border-bfb-navy bg-bfb-navy text-white hover:border-bfb-blue hover:bg-bfb-blue",
  },
  gala: {
    shell: "border-b border-white/15 bg-sftc-ink/90 text-white shadow-sm backdrop-blur",
    brand: "text-white hover:text-sftc-gold",
    link: "text-white/72 hover:text-white",
    icon: "text-sftc-gold",
    cta: "border-white/35 bg-white/10 text-white hover:border-sftc-gold hover:bg-white/15",
  },
} as const;

export function EventPageNav({ tone, ctaHref, ctaLabel }: EventPageNavProps) {
  const styles = toneStyles[tone];

  return (
    <nav className={styles.shell} aria-label="Event navigation">
      <div className="section-shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-[0.04em] transition ${styles.brand}`}
        >
          CITY CENTER EVENTS
        </Link>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:justify-end sm:gap-x-5">
          <Link
            href="https://okcitycenter.org/"
            className={`inline-flex min-h-8 items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-[0.04em] transition sm:text-sm ${styles.link}`}
          >
            <Home aria-hidden="true" className={styles.icon} size={14} />
            CITY CENTER HOME
          </Link>
          <Link
            href="/supporters"
            className={`inline-flex min-h-8 items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-[0.04em] transition sm:text-sm ${styles.link}`}
          >
            <UsersRound aria-hidden="true" className={styles.icon} size={14} />
            SUPPORTERS
          </Link>
          <Link
            href="/development"
            className={`inline-flex min-h-8 items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-[0.04em] transition sm:text-sm ${styles.link}`}
          >
            <LockKeyhole aria-hidden="true" className={styles.icon} size={14} />
            DASHBOARD
          </Link>
          {ctaHref && ctaLabel ? (
            <a
              href={ctaHref}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-sm border px-3 py-2 font-heading text-xs font-semibold uppercase tracking-[0.04em] transition sm:text-sm ${styles.cta}`}
            >
              {ctaLabel}
              <ArrowRight aria-hidden="true" size={14} />
            </a>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
