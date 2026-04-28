import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { BowlingAdminConsole } from "@/components/bowling/BowlingAdminConsole";
import { listBowlingRegistrations } from "@/lib/bowling/database";
import { isDevelopmentAuthenticated } from "@/lib/events/development-auth";

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
  const hasDevelopmentAccess = await isDevelopmentAuthenticated();
  const isAllowed =
    hasDevelopmentAccess ||
    process.env.NODE_ENV !== "production" ||
    (previewKey && key === previewKey);
  const liveRegistrations = isAllowed ? await listBowlingRegistrations() : null;
  const registrations = liveRegistrations ?? [];
  const dataSource = liveRegistrations ? "live" : "preview";

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-cc-light-blue/35 py-16">
        <div className="ops-shell max-w-3xl">
          <section className="ops-card p-8 sm:p-10">
            <LockKeyhole aria-hidden="true" className="text-cc-sky-blue" size={42} />
            <p className="ops-eyebrow mt-8">Admin protected</p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-cc-dark-blue">
              Add a preview key to view the Bowling admin console.
            </h1>
            <p className="ops-copy mt-5">
              Set BOWLING_ADMIN_PREVIEW_KEY and pass it as a key query parameter
              until the real auth layer is connected.
            </p>
            <Link href="/bowling-for-backpacks" className="ops-secondary mt-8">
              Back to event
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cc-light-blue/35 py-10">
      <div className="ops-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="ops-eyebrow">City Center</p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-cc-dark-blue">
              Bowling admin {dataSource === "live" ? "dashboard" : "preview"}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-cc-dark-blue/70">
              Track teams, sponsors, lanes, payment follow-up, logo status, bowler
              completion, and export readiness.
            </p>
          </div>
          <Link href="/bowling-for-backpacks" className="ops-secondary">
            View public page
          </Link>
        </div>
        <BowlingAdminConsole
          exportKey={hasDevelopmentAccess ? undefined : key}
          registrations={registrations}
          dataSource={dataSource}
        />
      </div>
    </main>
  );
}
