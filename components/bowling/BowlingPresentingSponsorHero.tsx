import Image from "next/image";

const presentingSponsor = {
  name: "Presenting Sponsor Available",
  logo: "",
  href: "/bowling-for-backpacks#sponsorships",
};

export function BowlingPresentingSponsorHero() {
  return (
    <a
      href={presentingSponsor.href}
      className="mt-7 inline-flex max-w-xl items-center gap-4 rounded-sm border border-bfb-green/35 bg-white/10 p-4 text-left shadow-soft backdrop-blur transition hover:border-bfb-green hover:bg-white/15"
    >
      <span className="flex min-h-16 min-w-28 items-center justify-center rounded-sm bg-white px-4 py-3">
        {presentingSponsor.logo ? (
          <Image
            src={presentingSponsor.logo}
            alt={presentingSponsor.name}
            width={180}
            height={72}
            className="max-h-12 w-auto object-contain"
          />
        ) : (
          <span className="font-heading text-[11px] font-black uppercase tracking-wide text-bfb-navy/70">
            Sponsor Available
          </span>
        )}
      </span>
      <span>
        <span className="block font-heading text-xs font-black uppercase tracking-[0.18em] text-bfb-green">
          Presenting Sponsor
        </span>
        <span className="mt-1 block text-sm font-semibold leading-6 text-white/80">
          Lead the event and help students begin the school year ready.
        </span>
      </span>
    </a>
  );
}
