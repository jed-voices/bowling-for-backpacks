import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Download,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  UsersRound,
} from "lucide-react";

export const metadata: Metadata = {
  title: "City Center Brand Preview",
  description: "A preview of the proposed City Center event color system.",
};

const colors = {
  deepCivicNavy: "#121230",
  cityBlue: "#213468",
  sage: "#89AF94",
  blueGray: "#ABBCC6",
  cloudWhite: "#F8FBFC",
  charcoalNavy: "#16222E",
};

const previousColors = {
  deepNavy: "#11132F",
  activeBlue: "#112F6D",
  skyBlue: "#3F9FEC",
  softGray: "#E8E9EA",
  brightGreen: "#5DCBA3",
  warmWhite: "#F7F8F4",
};

const previousLook = {
  name: "Previous Event Look",
  note: "Brighter, more energetic, and more event-forward.",
  background: previousColors.warmWhite,
  header: previousColors.deepNavy,
  headline: previousColors.deepNavy,
  label: previousColors.skyBlue,
  body: previousColors.deepNavy,
  primary: previousColors.activeBlue,
  primaryText: "#FFFFFF",
  secondary: previousColors.brightGreen,
  secondaryText: previousColors.deepNavy,
  panel: previousColors.softGray,
  border: "rgba(17,19,47,0.12)",
  swatches: [
    ["Ink", previousColors.deepNavy],
    ["Navy", previousColors.activeBlue],
    ["Sky", previousColors.skyBlue],
    ["Green", previousColors.brightGreen],
    ["Light", previousColors.softGray],
  ],
};

const proposedLook = {
  name: "New City Center Look",
  note: "More grounded, civic, quiet, and donor-ready.",
  background: colors.cloudWhite,
  header: colors.deepCivicNavy,
  headline: colors.cityBlue,
  label: colors.cityBlue,
  body: colors.charcoalNavy,
  primary: colors.deepCivicNavy,
  primaryText: colors.cloudWhite,
  secondary: colors.sage,
  secondaryText: colors.deepCivicNavy,
  panel: `${colors.blueGray}33`,
  border: `${colors.blueGray}99`,
  swatches: [
    ["Deep", colors.deepCivicNavy],
    ["City", colors.cityBlue],
    ["Sage", colors.sage],
    ["Blue Gray", colors.blueGray],
    ["Cloud", colors.cloudWhite],
  ],
};

const palette = [
  {
    name: "Deep Civic Navy",
    hex: colors.deepCivicNavy,
    use: "Headers, footers, primary buttons, serious donor sections",
  },
  {
    name: "City Blue",
    hex: colors.cityBlue,
    use: "Hero text, navigation, section headlines, links",
  },
  {
    name: "Sage",
    hex: colors.sage,
    use: "Program icons, quote marks, secondary buttons, restoration moments",
  },
  {
    name: "Blue Gray",
    hex: colors.blueGray,
    use: "Soft background panels, form areas, quiet structure",
  },
  {
    name: "Cloud White",
    hex: colors.cloudWhite,
    use: "Main page background, cards, breathable sections",
  },
  {
    name: "Charcoal Navy",
    hex: colors.charcoalNavy,
    use: "Body text, footer, high-contrast utility panels",
  },
];

export default function BrandPreviewPage() {
  return (
    <main
      className="min-h-screen font-body"
      style={{
        backgroundColor: colors.cloudWhite,
        color: colors.charcoalNavy,
      }}
    >
      <header
        className="border-b"
        style={{ backgroundColor: colors.deepCivicNavy, color: colors.cloudWhite }}
      >
        <div className="section-shell py-4">
          <nav className="flex items-center justify-between gap-4 text-sm">
            <Link href="/" className="font-heading font-bold uppercase text-white">
              City Center Events
            </Link>
            <div className="flex items-center gap-4 text-white/72 sm:gap-5">
              <Link href="/supporters" className="transition hover:text-white">
                Supporters
              </Link>
              <Link href="/development" className="transition hover:text-white">
                Development
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="section-shell grid gap-10 py-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(340px,0.5fr)] lg:items-center lg:py-20">
        <div>
          <p
            className="font-heading text-xs font-bold uppercase leading-none"
            style={{ color: colors.sage }}
          >
            Brand system preview
          </p>
          <h1
            className="mt-5 max-w-4xl font-heading text-4xl font-bold leading-[1.04] sm:text-6xl"
            style={{ color: colors.cityBlue }}
          >
            A calmer City Center palette with more civic weight.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 sm:text-lg" style={{ color: colors.charcoalNavy }}>
            The comparison below places the previous event look next to the
            proposed City Center system using the same sample content.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#comparison"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-5 py-3 font-heading text-sm font-bold uppercase transition"
              style={{
                backgroundColor: colors.deepCivicNavy,
                color: colors.cloudWhite,
              }}
            >
              Compare Looks
              <ArrowRight aria-hidden="true" size={16} />
            </a>
            <Link
              href="/supporters"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-5 py-3 font-heading text-sm font-bold uppercase transition"
              style={{
                backgroundColor: colors.sage,
                color: colors.deepCivicNavy,
              }}
            >
              Supporter Path
              <HeartHandshake aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>

        <aside
          className="rounded-sm border p-5 shadow-sm"
          style={{
            backgroundColor: `${colors.blueGray}33`,
            borderColor: `${colors.blueGray}99`,
          }}
        >
          <p className="font-heading text-xs font-bold uppercase" style={{ color: colors.cityBlue }}>
            Best usage
          </p>
          <div className="mt-5 space-y-4">
            <Usage label="Deep Navy" text="Headers, footers, primary buttons, and serious donor sections." />
            <Usage label="City Blue" text="Hero text, navigation, section headlines, and links." />
            <Usage label="Sage" text="Program icons, quote marks, secondary buttons, and restoration moments." />
            <Usage label="Blue Gray" text="Soft background panels and form areas." />
            <Usage label="Cloud White" text="Main website background." />
          </div>
        </aside>
      </section>

      <section id="comparison" className="section-shell pb-16">
        <div className="grid grid-cols-2 gap-4 lg:gap-5">
          <BrandLookPanel look={previousLook} />
          <BrandLookPanel look={proposedLook} />
        </div>
      </section>

      <section
        className="border-y"
        style={{
          backgroundColor: colors.deepCivicNavy,
          borderColor: "rgba(248,251,252,0.14)",
          color: colors.cloudWhite,
        }}
      >
        <div className="section-shell grid gap-10 py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,0.52fr)] lg:items-end">
          <div>
            <p
              className="font-heading text-xs font-bold uppercase leading-none"
              style={{ color: colors.sage }}
            >
              Serious donor section
            </p>
            <h2 className="mt-5 max-w-3xl font-heading text-3xl font-bold leading-tight sm:text-5xl">
              A grounded space for major gifts and long-term partnership.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
              Deep Navy gives donor moments the right weight without making the
              page feel heavy everywhere.
            </p>
          </div>

          <aside
            className="rounded-sm border p-5 shadow-sm"
            style={{
              backgroundColor: "rgba(248,251,252,0.08)",
              borderColor: "rgba(248,251,252,0.16)",
            }}
          >
            <p className="font-heading text-xs font-bold uppercase text-white/58">
              Quote treatment
            </p>
            <p className="mt-4 font-heading text-5xl font-bold leading-none" style={{ color: colors.sage }}>
              &ldquo;
            </p>
            <p className="mt-3 text-sm leading-6 text-white/68">
              City Center language can stay relational and clear while the
              palette carries more depth.
            </p>
          </aside>
        </div>
      </section>

      <section className="section-shell py-14 sm:py-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {palette.map((item) => (
            <article
              key={item.hex}
              className="overflow-hidden rounded-sm border bg-white shadow-sm"
              style={{ borderColor: `${colors.blueGray}66` }}
            >
              <div
                className="h-24 border-b"
                style={{
                  backgroundColor: item.hex,
                  borderColor: `${colors.blueGray}66`,
                }}
              />
              <div className="p-4">
                <h2 className="font-heading text-base font-bold" style={{ color: colors.deepCivicNavy }}>
                  {item.name}
                </h2>
                <p className="mt-1 font-heading text-xs font-bold uppercase" style={{ color: colors.cityBlue }}>
                  {item.hex}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.use}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="samples" className="section-shell pb-16">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.55fr)]">
          <article className="rounded-sm border bg-white p-6 shadow-sm sm:p-7" style={{ borderColor: `${colors.blueGray}70` }}>
            <p className="font-heading text-xs font-bold uppercase" style={{ color: colors.cityBlue }}>
              Public event card
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight sm:text-4xl" style={{ color: colors.cityBlue }}>
              Christmas in July | Bowling for Backpacks
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: colors.charcoalNavy }}>
              A City Center event helping students and families begin the
              school year with practical support, steady care, and dignity.
            </p>

            <div className="mt-6 grid gap-3 text-sm leading-6 sm:grid-cols-2">
              <p className="flex items-center gap-2">
                <CalendarDays aria-hidden="true" style={{ color: colors.sage }} size={18} />
                July 16, 2026
              </p>
              <p className="flex items-center gap-2">
                <MapPin aria-hidden="true" style={{ color: colors.cityBlue }} size={18} />
                Andy B&apos;s, Oklahoma City
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {["Event Sponsor", "Team Registration", "Lane Sponsor"].map((label) => (
                <div
                  key={label}
                  className="rounded-sm border p-4"
                  style={{
                    backgroundColor: colors.cloudWhite,
                    borderColor: `${colors.blueGray}88`,
                  }}
                >
                  <Check aria-hidden="true" style={{ color: colors.sage }} size={18} />
                  <p className="mt-3 font-heading text-sm font-bold" style={{ color: colors.deepCivicNavy }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm px-5 py-3 font-heading text-sm font-bold uppercase transition"
                style={{
                  backgroundColor: colors.deepCivicNavy,
                  color: colors.cloudWhite,
                }}
              >
                Register
                <ArrowRight aria-hidden="true" size={16} />
              </a>
              <a
                href="#"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm border bg-white px-5 py-3 font-heading text-sm font-bold uppercase transition"
                style={{
                  backgroundColor: colors.sage,
                  borderColor: colors.sage,
                  color: colors.deepCivicNavy,
                }}
              >
                Sponsor
                <HeartHandshake aria-hidden="true" size={16} />
              </a>
            </div>
          </article>

          <aside
            className="rounded-sm border p-6 shadow-sm"
            style={{
              backgroundColor: colors.deepCivicNavy,
              borderColor: colors.deepCivicNavy,
              color: colors.cloudWhite,
            }}
          >
            <p className="font-heading text-xs font-bold uppercase" style={{ color: colors.sage }}>
              Development panel
            </p>
            <h2 className="mt-4 font-heading text-2xl font-bold leading-tight">
              CITY CENTER EVENT DESK
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/68">
              The operational side can stay dark, focused, and distinct from
              the public event pages.
            </p>
            <div className="mt-6 grid gap-3">
              <Metric label="Registrations" value="24" />
              <Metric label="Visible Value" value="$18,450" />
              <Metric label="Exports" value="Ready" />
            </div>
            <button
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm px-4 py-2 font-heading text-sm font-bold uppercase"
              style={{
                backgroundColor: colors.cloudWhite,
                color: colors.deepCivicNavy,
              }}
              type="button"
            >
              <Download aria-hidden="true" size={16} />
              Export
            </button>
          </aside>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <SampleNote
            icon={<UsersRound aria-hidden="true" size={21} />}
            title="Public Pages"
            body="Cloud White carries the page, while City Blue gives headlines and links a steady civic tone."
          />
          <SampleNote
            icon={<LockKeyhole aria-hidden="true" size={21} />}
            title="Dashboard"
            body="Deep Navy and Charcoal Navy keep the internal desk focused and distinct."
          />
          <SampleNote
            icon={<HeartHandshake aria-hidden="true" size={21} />}
            title="Sponsorship"
            body="Primary donor actions feel strongest in Deep Navy, with Sage supporting softer moments."
          />
        </div>
      </section>
      <footer
        className="border-t py-7"
        style={{
          backgroundColor: colors.deepCivicNavy,
          borderColor: "rgba(248,251,252,0.14)",
          color: colors.cloudWhite,
        }}
      >
        <div className="section-shell flex flex-col gap-2 text-sm text-white/62 sm:flex-row sm:items-center sm:justify-between">
          <p>City Center / Brand Preview</p>
          <Link href="/development" className="font-heading font-bold" style={{ color: colors.sage }}>
            Back to Development
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Usage({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-l-4 bg-white/72 py-2 pl-4" style={{ borderColor: colors.sage }}>
      <p className="font-heading text-sm font-bold" style={{ color: colors.deepCivicNavy }}>
        {label}
      </p>
      <p className="mt-1 text-sm leading-5" style={{ color: colors.charcoalNavy }}>
        {text}
      </p>
    </div>
  );
}

function BrandLookPanel({ look }: { look: typeof previousLook }) {
  return (
    <article
      className="overflow-hidden rounded-sm border shadow-sm"
      style={{ backgroundColor: look.background, borderColor: look.border }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-4 text-[11px] sm:text-sm"
        style={{ backgroundColor: look.header, color: "#FFFFFF" }}
      >
        <p className="font-heading font-bold">City Center</p>
        <div className="flex gap-4 text-white/72">
          <span>Events</span>
          <span>Access</span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <p className="font-heading text-xs font-bold uppercase" style={{ color: look.label }}>
          {look.name}
        </p>
        <h2 className="mt-4 font-heading text-xl font-bold leading-tight sm:text-2xl lg:text-3xl" style={{ color: look.headline }}>
          Christmas in July | Bowling for Backpacks
        </h2>
        <p className="mt-3 text-sm leading-6" style={{ color: look.body }}>
          {look.note}
        </p>

        <div
          className="mt-6 rounded-sm border p-4"
          style={{ backgroundColor: "#FFFFFF", borderColor: look.border }}
        >
          <div className="grid gap-3 text-sm leading-6 sm:grid-cols-2">
            <p className="flex items-center gap-2" style={{ color: look.body }}>
              <CalendarDays aria-hidden="true" style={{ color: look.secondary }} size={18} />
              July 16, 2026
            </p>
            <p className="flex items-center gap-2" style={{ color: look.body }}>
              <MapPin aria-hidden="true" style={{ color: look.label }} size={18} />
              Andy B&apos;s, Oklahoma City
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {["Event Sponsor", "Team Registration", "Lane Sponsor"].map((label) => (
              <div
                key={label}
                className="rounded-sm border p-3"
                style={{ backgroundColor: look.panel, borderColor: look.border }}
              >
                <Check aria-hidden="true" style={{ color: look.secondary }} size={17} />
                <p className="mt-3 font-heading text-sm font-bold" style={{ color: look.headline }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="#samples"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 py-2 font-heading text-sm font-bold uppercase"
              style={{ backgroundColor: look.primary, color: look.primaryText }}
            >
              Register
              <ArrowRight aria-hidden="true" size={16} />
            </a>
            <a
              href="#samples"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 py-2 font-heading text-sm font-bold uppercase"
              style={{ backgroundColor: look.secondary, color: look.secondaryText }}
            >
              Sponsor
              <HeartHandshake aria-hidden="true" size={16} />
            </a>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-5 overflow-hidden rounded-sm border" style={{ borderColor: look.border }}>
          {look.swatches.map(([name, hex]) => (
            <div key={hex} className="min-h-24 p-2" style={{ backgroundColor: hex }}>
              <p
                className="font-heading text-[10px] font-bold uppercase leading-tight"
                style={{
                  color:
                    hex === previousColors.softGray ||
                    hex === previousColors.warmWhite ||
                    hex === colors.blueGray ||
                    hex === colors.cloudWhite
                      ? look.header
                      : "#FFFFFF",
                }}
              >
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-white/12 bg-white/[0.06] p-4">
      <p className="font-heading text-xs font-bold uppercase text-white/48">{label}</p>
      <p className="mt-2 font-heading text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function SampleNote({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article
      className="rounded-sm border bg-white p-5 shadow-sm"
      style={{ borderColor: `${colors.blueGray}70` }}
    >
      <div style={{ color: colors.sage }}>{icon}</div>
      <h2 className="mt-4 font-heading text-xl font-bold" style={{ color: colors.deepCivicNavy }}>
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}
