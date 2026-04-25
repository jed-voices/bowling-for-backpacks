import type { Metadata } from "next";
import { BowlingEventDetails } from "@/components/bowling/BowlingEventDetails";
import { BowlingExperience } from "@/components/bowling/BowlingExperience";
import { BowlingFAQ } from "@/components/bowling/BowlingFAQ";
import { BowlingFooterCTA } from "@/components/bowling/BowlingFooterCTA";
import { BowlingHero } from "@/components/bowling/BowlingHero";
import { BowlingImpactSection } from "@/components/bowling/BowlingImpactSection";
import { BowlingRegistrationForm } from "@/components/bowling/BowlingRegistrationForm";
import { BowlingRegistrationOptions } from "@/components/bowling/BowlingRegistrationOptions";
import { BowlingSessionSection } from "@/components/bowling/BowlingSessionSection";
import { BowlingSponsorshipGrid } from "@/components/bowling/BowlingSponsorshipGrid";
import { BowlingSupportProvides } from "@/components/bowling/BowlingSupportProvides";
import { BowlingWhyItMatters } from "@/components/bowling/BowlingWhyItMatters";
import { listBowlingRegistrations } from "@/lib/bowling/database";

export const metadata: Metadata = {
  title:
    "Bowling for Backpacks | Bringing Christmas to Students for Back to School",
  description:
    "Register a team, sponsor a lane, or make a gift for Bowling for Backpacks, City Center's Christmas in July fundraiser bringing Christmas to students for back to school.",
  keywords: [
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
    "City Center back to school bash",
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
      <BowlingSessionSection registrations={liveRegistrations ?? undefined} />
      <BowlingSupportProvides />
      <BowlingExperience />
      <BowlingRegistrationForm registrations={liveRegistrations ?? undefined} />
      <BowlingFAQ />
      <BowlingFooterCTA />
    </main>
  );
}
