import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

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
        <Link href="/gala" className="button-quiet">
          Back to Gala
        </Link>
        <section className="mt-8 rounded-sm border border-sftc-ink/10 bg-white p-8 shadow-soft sm:p-10">
          <ClipboardList aria-hidden="true" className="text-sftc-brass" size={42} />
          <p className="eyebrow mt-8">Guest list builder</p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-tight text-sftc-ink">
            Guest names can live here once Supabase is connected.
          </h1>
          <p className="body-copy mt-6">
            Registration {registrationId} has a dedicated guest-list route in place.
            The static prototype already builds guest fields inside the registration flow;
            this page is prepared for the later saved-link experience.
          </p>
          <div className="mt-8 rounded-sm bg-sftc-stone p-5 text-sm leading-6 text-sftc-ink/70">
            Future behavior: fetch the registration, show included seats, save guest
            rows, and mark guest-list completion for the admin dashboard.
          </div>
        </section>
      </div>
    </main>
  );
}
