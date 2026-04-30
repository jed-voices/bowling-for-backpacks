import type { Metadata } from "next";
import { AuctionSection } from "@/components/gala/AuctionSection";
import { EventDetails } from "@/components/gala/EventDetails";
import { EveningExperience } from "@/components/gala/EveningExperience";
import { FAQSection } from "@/components/gala/FAQSection";
import { FooterCTA } from "@/components/gala/FooterCTA";
import { GalaHero } from "@/components/gala/GalaHero";
import { ImpactSection } from "@/components/gala/ImpactSection";
import { RallyCry } from "@/components/gala/RallyCry";
import { RegistrationForm } from "@/components/gala/RegistrationForm";
import { ScheduleSection } from "@/components/gala/ScheduleSection";
import { SponsorshipGrid } from "@/components/gala/SponsorshipGrid";
import { TicketOptions } from "@/components/gala/TicketOptions";
import { VoicesOfOKCSection } from "@/components/gala/VoicesOfOKCSection";
import { WhyItMatters } from "@/components/gala/WhyItMatters";

export const metadata: Metadata = {
  title: "Stories From the Center | City Center Annual Gala 2026 in Oklahoma City",
  description:
    "Join City Center for Stories From the Center, the annual Gala in Oklahoma City. Reserve tickets, sponsor a table, preview auction opportunities, and help carry the work of relief and restoration into another year.",
};

export default function GalaPage() {
  return (
    <main id="top">
      <GalaHero />
      <EventDetails />
      <WhyItMatters />
      <ImpactSection />
      <RallyCry />
      <EveningExperience />
      <ScheduleSection />
      <SponsorshipGrid />
      <TicketOptions />
      <AuctionSection />
      <VoicesOfOKCSection />
      <RegistrationForm />
      <FAQSection />
      <FooterCTA />
    </main>
  );
}
