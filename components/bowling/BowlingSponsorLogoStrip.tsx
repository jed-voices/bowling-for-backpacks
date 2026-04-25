const sponsors = [
  "Presenting Sponsor",
  "Corporate Session Sponsor",
  "Family Night Sponsor",
  "Lane Sponsors",
  "Friends of City Center",
];

export function BowlingSponsorLogoStrip() {
  return (
    <div className="rounded-sm border border-white/15 bg-white/10 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-xs font-black uppercase tracking-[0.2em] text-bfb-green">
            Sponsor recognition
          </p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Partner logos will be featured here as sponsorships are confirmed.
          </p>
        </div>
        <a
          href="/bowling-for-backpacks#sponsorships"
          className="inline-flex min-h-10 items-center justify-center rounded-sm border border-white/25 px-4 py-2 font-heading text-xs font-black uppercase tracking-wide text-white transition hover:border-bfb-green hover:bg-white/10"
        >
          Become a Sponsor
        </a>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor}
            className="flex min-h-20 items-center justify-center rounded-sm border border-white/15 bg-white/90 px-4 py-4 text-center font-heading text-xs font-black uppercase tracking-wide text-bfb-navy shadow-sm"
          >
            {sponsor}
          </div>
        ))}
      </div>
    </div>
  );
}
