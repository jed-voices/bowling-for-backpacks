import type { Metadata } from "next";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { AdminExportConsole } from "@/components/gala/AdminExportConsole";

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
  const isAllowed = process.env.NODE_ENV !== "production" || (previewKey && key === previewKey);

  if (!isAllowed) {
    return (
      <main className="min-h-screen bg-sftc-ivory py-16">
        <div className="section-shell max-w-3xl">
          <section className="rounded-sm border border-sftc-ink/10 bg-white p-8 shadow-soft sm:p-10">
            <LockKeyhole aria-hidden="true" className="text-sftc-brass" size={42} />
            <p className="eyebrow mt-8">Admin protected</p>
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight text-sftc-ink">
              Add a preview key to view the Gala admin console.
            </h1>
            <p className="body-copy mt-5">
              Set GALA_ADMIN_PREVIEW_KEY and pass it as a key query parameter until
              the real auth layer is connected.
            </p>
            <Link href="/gala" className="button-quiet mt-8">
              Back to Gala
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sftc-ivory py-10">
      <div className="section-shell">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">City Center Gala</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight text-sftc-ink">
              Admin preview
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-sftc-ink/70">
              Review registrations, payment status, guest-list completion, and
              export readiness before Supabase and live payments are wired.
            </p>
          </div>
          <Link href="/gala" className="button-quiet">
            View public page
          </Link>
        </div>
        <AdminExportConsole exportKey={key} />
      </div>
    </main>
  );
}
