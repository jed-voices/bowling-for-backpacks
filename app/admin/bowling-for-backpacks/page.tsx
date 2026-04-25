import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { BowlingAdminConsole } from "@/components/bowling/BowlingAdminConsole";
import { sampleBowlingRegistrations } from "@/lib/bowling/config";
import { listBowlingRegistrations } from "@/lib/bowling/database";

export const metadata: Metadata = {
  title: "Bowling Admin",
};

type AdminBowlingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBowlingPage({ searchParams }: AdminBowlingPageProps) {
  const params = (await searchParams) ?? {};
  const key = typeof params.key === "string" ? params.key : "";
  const previewKey = process.env.BOWLING_ADMIN_PREVIEW_KEY;
  const isAllowed = process.env.NODE_ENV !== "production" || (previewKey && key === previewKey);
  const liveRegistrations = isAllowed ? await listBowlingRegistrations() : null;
  const registrations = liveRegistrations ?? sampleBowlingRegistrations;
  const dataSource = liveRegistrations ? "live" : "preview";

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-bfb-cream py-16">
        <div className="bfb-shell max-w-3xl">
          <section className="rounded-sm border border-bfb-ink/10 bg-white p-8 shadow-soft sm:p-10">
            <LockKeyhole aria-hidden="true" className="text-bfb-blue" size={42} />
            <p className="bfb-eyebrow mt-8">Admin protected</p>
            <h1 className="mt-4 font-heading text-4xl font-black leading-tight text-bfb-ink">
              Add a preview key to view the Bowling admin console.
            </h1>
            <p className="bfb-copy mt-5">
              Set BOWLING_ADMIN_PREVIEW_KEY and pass it as a key query parameter
              until the real auth layer is connected.
            </p>
            <Link href="/bowling-for-backpacks" className="bfb-secondary mt-8">
              Back to event
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bfb-cream py-10">
      <div className="bfb-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="bfb-eyebrow">City Center</p>
            <h1 className="mt-3 font-heading text-4xl font-black leading-tight text-bfb-ink">
              Bowling admin {dataSource === "live" ? "dashboard" : "preview"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-bfb-ink/70">
              Track teams, sponsors, lanes, payment follow-up, logo status, bowler
              completion, and export readiness.
            </p>
          </div>
          <Link href="/bowling-for-backpacks" className="bfb-secondary">
            View public page
          </Link>
        </div>
        <BowlingAdminConsole
          exportKey={key}
          registrations={registrations}
          dataSource={dataSource}
        />
      </div>
    </main>
  );
}
