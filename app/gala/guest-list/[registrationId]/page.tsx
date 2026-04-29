import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { EventGatewayBackLink } from "@/components/events/EventGatewayBackLink";

export const metadata: Metadata = {
  title: "Guest List",
};

type GuestListPageProps = {
  params: Promise<{ registrationId: string }>;
};

export default async function GuestListPage({ params }: GuestListPageProps) {
  const { registrationId } = await params;

  return (
    <main className="min-h-screen bg-sftc-ivory py-16">
      <div className="section-shell max-w-4xl">
        <EventGatewayBackLink tone="gala" />
        <section className="mt-8 rounded-sm border border-sftc-ink/10 bg-white p-8 shadow-soft sm:p-10">
          <ClipboardList aria-hidden="true" className="text-sftc-brass" size={42} />
          <p className="eyebrow mt-8">Guest list builder</p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-tight text-sftc-ink">
            Your guest-list link is ready.
          </h1>
          <p className="body-copy mt-6">
            Registration {registrationId} has a dedicated place for table hosts to
            gather guest names as they are confirmed.
          </p>
          <div className="mt-8 rounded-sm bg-sftc-stone p-5 text-sm leading-6 text-sftc-ink/70">
            Keep this link handy. City Center will use the guest information to
            help welcome your table well on event night.
          </div>
        </section>
      </div>
    </main>
  );
}
