import Link from "next/link";
import { BarChart3, Download, Heart, ShieldCheck } from "lucide-react";
import { bowlingEventConfig, bowlingSessions, sampleBowlingRegistrations } from "@/lib/bowling/config";
import { formatCurrency, remainingLanes } from "@/lib/bowling/validation";

export function BowlingFooterCTA() {
  const teamCount = sampleBowlingRegistrations.filter(
    (registration) =>
      registration.registrationType === "team" || registration.registrationType === "sponsorship",
  ).length;
  const grandTotal = sampleBowlingRegistrations.reduce(
    (sum, registration) => sum + registration.grandTotal,
    0,
  );
  const followUpCount = sampleBowlingRegistrations.filter(
    (registration) =>
      registration.paymentStatus === "invoice_requested" ||
      registration.paymentStatus === "check_pledged" ||
      (registration.registrationType !== "team" && !registration.sponsorLogoName),
  ).length;
  const laneSummary = bowlingSessions
    .map((session) => `${session.name}: ${remainingLanes(session.id)}`)
    .join(" / ");

  return (
    <footer className="bg-bfb-ink text-white">
      <section className="bfb-shell grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="bfb-eyebrow text-white">Can&apos;t bowl?</p>
          <h2 className="mt-4 font-heading text-3xl font-black leading-tight sm:text-5xl">
            Give a Christmas-in-July gift anyway.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Help provide backpacks, school supplies, and practical support for
            students and families in Oklahoma City.
          </p>
        </div>
        <a href="#registration" className="bfb-primary bg-bfb-green text-bfb-ink hover:bg-bfb-blue">
          Make a Gift
          <Heart aria-hidden="true" size={17} />
        </a>
      </section>

      <section className="border-t border-white/15 py-10" aria-labelledby="bowling-admin-preview">
        <div className="bfb-shell">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="bfb-eyebrow text-white">Admin/export preview</p>
              <h2
                id="bowling-admin-preview"
                className="mt-4 font-heading text-3xl font-black leading-tight sm:text-4xl"
              >
                Staff can track teams, lanes, payments, and exports.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                The Bowling for Backpacks admin system mirrors the Gala pattern with
                registration metrics, follow-up flags, capacity checks, and export-ready data.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <PreviewMetric label="Preview registrations" value={sampleBowlingRegistrations.length.toString()} />
              <PreviewMetric label="Teams registered" value={teamCount.toString()} />
              <PreviewMetric label="Projected total" value={formatCurrency(grandTotal)} />
              <PreviewMetric label="Follow-up records" value={followUpCount.toString()} />
              <div className="rounded-sm border border-white/15 bg-white/[0.07] p-4 sm:col-span-2">
                <p className="text-xs font-bold uppercase text-white/45">Lanes remaining</p>
                <p className="mt-2 break-words font-heading text-lg font-black text-white">{laneSummary}</p>
              </div>
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
                <Link href="/admin/bowling-for-backpacks" className="bfb-secondary border-white/30 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  Admin Console
                  <ShieldCheck aria-hidden="true" size={16} />
                </Link>
                <Link href="/api/bowling/admin/exports/bloomerang-transactions" className="bfb-secondary border-white/30 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  Bloomerang CSV
                  <Download aria-hidden="true" size={16} />
                </Link>
                <Link href="/api/bowling/admin/exports/operations" className="bfb-secondary border-white/30 bg-white/[0.08] text-white hover:bg-white/[0.14]">
                  Operations CSV
                  <BarChart3 aria-hidden="true" size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/15 py-6">
        <div className="bfb-shell text-sm text-white/55">
          City Center / Bowling for Backpacks / {bowlingEventConfig.theme} / July 16, 2026
        </div>
      </div>
    </footer>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-white/15 bg-white/[0.07] p-4">
      <p className="text-xs font-bold uppercase text-white/45">{label}</p>
      <p className="mt-2 font-heading text-2xl font-black text-white">{value}</p>
    </div>
  );
}
