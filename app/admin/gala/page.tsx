import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { AdminExportConsole } from "@/components/gala/AdminExportConsole";
import { isDevelopmentAuthenticated } from "@/lib/events/development-auth";

export const metadata: Metadata = {
  title: "Gala Admin",
};

type AdminGalaPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminGalaPage({ searchParams }: AdminGalaPageProps) {
  const params = (await searchParams) ?? {};
  const key = typeof params.key === "string" ? params.key : "";
  const previewKey = process.env.GALA_ADMIN_PREVIEW_KEY;
  const hasDevelopmentAccess = await isDevelopmentAuthenticated();
  const isAllowed =
    hasDevelopmentAccess ||
    process.env.NODE_ENV !== "production" ||
    (previewKey && key === previewKey);

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-cc-light-blue/35 py-16">
        <div className="ops-shell max-w-3xl">
          <section className="ops-card p-8 sm:p-10">
            <LockKeyhole aria-hidden="true" className="text-cc-sky-blue" size={42} />
            <p className="ops-eyebrow mt-8">Admin protected</p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-cc-dark-blue">
              Add a preview key to view the Gala admin console.
            </h1>
            <p className="ops-copy mt-5">
              Set GALA_ADMIN_PREVIEW_KEY and pass it as a key query parameter until
              the real auth layer is connected.
            </p>
            <Link href="/gala" className="ops-secondary mt-8">
              Back to Gala
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
            <p className="ops-eyebrow">City Center Gala</p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-cc-dark-blue">
              Admin preview
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-cc-dark-blue/70">
              Review registrations, payment status, guest-list completion, and
              export readiness before Supabase and live payments are wired.
            </p>
          </div>
          <Link href="/gala" className="ops-secondary">
            View public page
          </Link>
        </div>
        <AdminExportConsole exportKey={hasDevelopmentAccess ? undefined : key} />
      </div>
    </main>
  );
}
