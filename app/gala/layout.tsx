import { Cormorant_Garamond, Prata } from "next/font/google";

// Typography lifted from the 2026 save-the-date: a high-contrast display serif
// for headlines, letterspaced serif caps for labels, and the script face for
// the one word the invitation sets in script.
const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gala-display",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-gala-label",
});

// The 2026 Gala runs on its own palette: charcoal ground, rich red action,
// gold accent. The tokens are redefined in .theme-gala (app/globals.css) so
// the rest of the events site keeps the navy identity.
export default function GalaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`theme-gala bg-sftc-ivory ${prata.variable} ${cormorant.variable}`}
      style={
        {
          "--font-display": "var(--font-gala-display), Georgia, serif",
          "--font-label": "var(--font-gala-label), Georgia, serif",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
