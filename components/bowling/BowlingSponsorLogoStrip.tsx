import Image from "next/image";

type Sponsor = {
  name: string;
  logo?: string;
  href: string;
};

const sponsorTiers: { label: string; featured?: boolean; sponsors: Sponsor[] }[] = [
  {
    label: "Event Sponsor",
    featured: true,
    sponsors: [
      {
        name: "Event Sponsor Available",
        href: "/bowling-for-backpacks#sponsorships",
      },
    ],
  },
  {
    label: "Team Sponsors",
    sponsors: [
      { name: "Corporate Team Available", href: "/bowling-for-backpacks#sponsorships" },
      { name: "Community Team Available", href: "/bowling-for-backpacks#sponsorships" },
    ],
  },
  {
    label: "Community Partners",
    sponsors: [
      { name: "Lane Sponsors", href: "/bowling-for-backpacks#sponsorships" },
      { name: "Gift Partners", href: "/bowling-for-backpacks#sponsorships" },
    ],
  },
];

function SponsorCard({ sponsor, featured = false }: { sponsor: Sponsor; featured?: boolean }) {
  const content = sponsor.logo ? (
    <Image
      src={sponsor.logo}
      alt={sponsor.name}
      width={featured ? 240 : 180}
      height={featured ? 100 : 80}
      className="max-h-16 w-auto object-contain grayscale transition duration-300 group-hover:grayscale-0"
    />
  ) : (
    <span className="font-heading text-xs font-black uppercase text-bfb-navy/70">
      {sponsor.name}
    </span>
  );

  return (
    <a
      href={sponsor.href}
      className={`group flex items-center justify-center rounded-sm border border-white/15 bg-white px-4 py-4 text-center shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-soft ${
        featured ? "min-h-24" : "min-h-20"
      }`}
    >
      {content}
    </a>
  );
}

export function BowlingSponsorLogoStrip() {
  return (
    <div className="rounded-sm border border-white/15 bg-white/10 p-5 shadow-soft backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-xs font-black uppercase text-bfb-green">
            Sponsor recognition
          </p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Confirmed sponsor logos will be featured by tier as partnerships come in.
          </p>
        </div>
        <a
          href="/bowling-for-backpacks#sponsorships"
          className="inline-flex min-h-10 items-center justify-center rounded-sm border border-white/25 px-4 py-2 font-heading text-xs font-black uppercase text-white transition hover:border-bfb-green hover:bg-white/10"
        >
          Become a Sponsor
        </a>
      </div>

      <div className="mt-5 space-y-5">
        {sponsorTiers.map((tier) => (
          <div key={tier.label}>
            <p className="mb-2 font-heading text-xs font-black uppercase text-white/55">
              {tier.label}
            </p>
            <div className={`grid gap-3 ${tier.featured ? "grid-cols-1" : "sm:grid-cols-2"}`}>
              {tier.sponsors.map((sponsor) => (
                <SponsorCard key={sponsor.name} sponsor={sponsor} featured={tier.featured} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
