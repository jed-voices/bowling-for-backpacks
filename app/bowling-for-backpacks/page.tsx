import type { Metadata } from "next";
import { BowlingEventDetails } from "@/components/bowling/BowlingEventDetails";
import { BowlingExperience } from "@/components/bowling/BowlingExperience";
import { BowlingFAQ } from "@/components/bowling/BowlingFAQ";
import { BowlingFooterCTA } from "@/components/bowling/BowlingFooterCTA";
import { BowlingHero } from "@/components/bowling/BowlingHero";
import { BowlingImpactSection } from "@/components/bowling/BowlingImpactSection";
import { BowlingMomentumSection } from "@/components/bowling/BowlingMomentumSection";
import { BowlingRegistrationForm } from "@/components/bowling/BowlingRegistrationForm";
import { BowlingRegistrationOptions } from "@/components/bowling/BowlingRegistrationOptions";
import { BowlingSessionSection } from "@/components/bowling/BowlingSessionSection";
import { BowlingSponsorshipGrid } from "@/components/bowling/BowlingSponsorshipGrid";
import { BowlingSupportProvides } from "@/components/bowling/BowlingSupportProvides";
import { BowlingWhyItMatters } from "@/components/bowling/BowlingWhyItMatters";
import { BowlingStickyMobileCTA } from "@/components/bowling/BowlingStickyMobileCTA";
import { listBowlingRegistrations } from "@/lib/bowling/database";

export const metadata: Metadata = {
  title:
    "Christmas in July | Bowling for Backpacks | Bringing Christmas to Students for Back to School",
  description:
    "Register a team, sponsor a lane, or make a gift for Christmas in July | Bowling for Backpacks, City Center's fundraiser bringing Christmas to students for back to school.",
  keywords: [
    "Christmas in July | Bowling for Backpacks",
    "Bowling for Backpacks",
    "bringing Christmas to students for back to school",
    "Christmas in July Oklahoma City",
    "Christmas in July fundraiser OKC",
    "City Center Oklahoma City",
    "City Center OKC",
    "Oklahoma City back to school fundraiser",
    "OKC charity bowling event",
    "Oklahoma City nonprofit fundraiser",
    "sponsor a lane Oklahoma City",
    "backpacks for students OKC",
    "school supplies fundraiser Oklahoma City",
    "support youth and families Oklahoma City",
    "City Center Back 2 School Bash",
  ],
};

export default async function BowlingForBackpacksPage() {
  const liveRegistrations = await listBowlingRegistrations();

  return (
    <main>
      <BowlingHero />
      <BowlingEventDetails />
      <BowlingWhyItMatters />
      <BowlingImpactSection />
      <BowlingRegistrationOptions />
      <BowlingSponsorshipGrid />
      <BowlingMomentumSection registrations={liveRegistrations ?? undefined} />
      <BowlingSessionSection registrations={liveRegistrations ?? undefined} />
      <BowlingSupportProvides />
      <BowlingExperience />
      <BowlingRegistrationForm registrations={liveRegistrations ?? undefined} />
      <BowlingFAQ />
      <BowlingFooterCTA />
      <BowlingStickyMobileCTA />
    </main>
  );
}
