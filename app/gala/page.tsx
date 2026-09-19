import type { Metadata } from "next";
import { eventConfig } from "@/lib/gala/config";
import { galaPhotos } from "@/lib/gala/photos";
import { AuctionSection } from "@/components/gala/AuctionSection";
import { EventDetails } from "@/components/gala/EventDetails";
import { EveningExperience } from "@/components/gala/EveningExperience";
import { FAQSection } from "@/components/gala/FAQSection";
import { FooterCTA } from "@/components/gala/FooterCTA";
import { GalaHero } from "@/components/gala/GalaHero";
import { ImpactSection } from "@/components/gala/ImpactSection";
import { RallyCry } from "@/components/gala/RallyCry";
import { RegisterSection } from "@/components/gala/RegisterSection";
import { ScheduleSection } from "@/components/gala/ScheduleSection";
import { SponsorshipGrid } from "@/components/gala/SponsorshipGrid";
import { VoicesOfOKCSection } from "@/components/gala/VoicesOfOKCSection";
import { WhyItMatters } from "@/components/gala/WhyItMatters";

export const metadata: Metadata = {
  title: "Stories From the Center | City Center's 9th Annual Gala, Oct. 30, 2026",
  description:
    "Join City Center for Stories From the Center, the 9th Annual Gala, on Friday, October 30, 2026, at City + State in Oklahoma City. Theme: Welcome to Our Neighborhood. Register, host a table, or give.",
  alternates: { canonical: "/gala" },
  openGraph: {
    title: "Stories From the Center | City Center's 9th Annual Gala",
    description:
      "Friday, October 30, 2026 at City + State, Oklahoma City. Welcome to Our Neighborhood.",
    url: "/gala",
    siteName: "City Center Events",
    type: "website",
    images: [{ url: galaPhotos.hero.src, alt: galaPhotos.hero.alt }],
  },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${eventConfig.name}: ${eventConfig.edition}`,
  startDate: `${eventConfig.isoDate}T17:30:00-05:00`,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: eventConfig.venue,
    address: eventConfig.address,
  },
  organizer: { "@type": "Organization", name: "City Center", url: "https://okcitycenter.org" },
  offers: {
    "@type": "Offer",
    url: eventConfig.registrationUrl,
    price: "250",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
};

export default function GalaPage() {
  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <GalaHero />
      <EventDetails />
      <WhyItMatters />
      <ImpactSection />
      <RallyCry />
      <EveningExperience />
      <ScheduleSection />
      <SponsorshipGrid />
      <AuctionSection />
      <VoicesOfOKCSection />
      <RegisterSection />
      <FAQSection />
      <FooterCTA />
    </main>
  );
}
