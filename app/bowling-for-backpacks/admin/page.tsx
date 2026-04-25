import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, CreditCard, Download, ExternalLink, Mail, UsersRound } from "lucide-react";
import { BowlingAdminActionButton } from "@/components/bowling/BowlingAdminActionButton";
import { isBowlingAdminAuthenticated } from "@/lib/bowling/admin-auth";
import { bowlingEventConfig } from "@/lib/bowling/config";
import { isBowlingDatabaseConfigured, listBowlingRegistrations } from "@/lib/bowling/database";
import type { BowlingRegistrationRecord } from "@/lib/bowling/types";

export const metadata: Metadata = {
  title: "Bowling Admin Dashboard",
};

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const completedBowlers = (registration: BowlingRegistrationRecord) =>
  registration.bowlers.filter((bowler) => bowler.firstName || bowler.lastName).length;

const needsBowlerFollowUp = (registration: BowlingRegistrationRecord) =>
  registration.laneCount > 0 && completedBowlers(registration) < bowlingEventConfig.teamSize;

const needsPaymentFollowUp = (registration: BowlingRegistrationRecord) => registration.paymentStatus !== "paid";
const needsExportFollowUp = (registration: BowlingRegistrationRecord) => registration.exportStatus !== "exported";
const teamLink = (registration: BowlingRegistrationRecord) => `${bowlingEventConfig.teamBaseUrl}/${registration.id}`;
const buyerName = (registration: BowlingRegistrationRecord) => `${registration.buyerFirstName} ${registration.buyerLastName}`.trim();

const mailtoForRegistration = (registration: BowlingRegistrationRecord) => {
  const subject = encodeURIComponent(`Bowling for Backpacks follow-up: ${registration.id}`);
  const body = encodeURIComponent(`Hi ${registration.buyerFirstName || buyerName(registration)},

Thank you again for being part of Bowling for Backpacks.

I wanted to follow up on your registration for ${registration.packageName}.

Confirmation code: ${registration.id}
Amount: ${formatMoney(registration.grandTotal)}
${registration.sessionName ? `Session: ${registration.sessionName}\n` : ""}${needsBowlerFollowUp(registration) ? `Team link: ${teamLink(registration)}\n` : ""}
Please let me know if you have any questions or if there is anything we can help with.

Grateful,
${bowlingEventConfig.contactName}
City Center`);

  return `mailto:${registration.buyerEmail}?subject=${subject}&body=${body}`;
};

function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-sm border border-bfb-ink/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-bfb-ink/50">{label}</p>
      <p className="mt-3 font-heading text-3xl font-black text-bfb-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-bfb-ink/65">{helper}</p>
    </div>
  );
}

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "good" | "warning" | "neutral" }) {
  const toneClass = tone === "good" ? "bg-bfb-green/20 text-bfb-navy" : tone === "warning" ? "bg-yellow-100 text-yellow-900" : "bg-bfb-light text-bfb-ink/75";
  return <span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${toneClass}`}>{children}</span>;
}

function ActionButtons({ registration }: { registration: BowlingRegistrationRecord }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <a href={mailtoForRegistration(registration)} className="inline-flex items-center gap-2 rounded-sm bg-bfb-navy px-3 py-2 font-heading text-xs font-bold uppercase text-white transition hover:bg-bfb-blue"><Mail aria-hidden="true" size={14} />Email</a>
      {registration.laneCount > 0 ? <Link href={teamLink(registration)} className="inline-flex items-center gap-2 rounded-sm border border-bfb-ink/10 bg-white px-3 py-2 font-heading text-xs font-bold uppercase text-bfb-navy transition hover:border-bfb-blue"><ExternalLink aria-hidden="true" size={14} />Team link</Link> : null}
      {registration.paymentStatus !== "paid" ? <BowlingAdminActionButton registrationId={registration.id} action="mark-paid" label="Mark paid" /> : null}
      {registration.exportStatus !== "exported" ? <BowlingAdminActionButton registrationId={registration.id} action="mark-exported" label="Mark exported" /> : null}
    </div>
  );
}

function FollowUpList({ registrations }: { registrations: BowlingRegistrationRecord[] }) {
  const followUps = registrations.filter((registration) => needsBowlerFollowUp(registration) || needsPaymentFollowUp(registration) || needsExportFollowUp(registration));
  return (
    <section className="rounded-sm border border-bfb-ink/10 bg-white p-6 shadow-soft">
      <div className="flex items-start gap-3"><AlertCircle aria-hidden="true" className="mt-1 text-bfb-blue" size={22} /><div><p className="bfb-eyebrow">Follow-up queue</p><h2 className="mt-2 font-heading text-2xl font-black text-bfb-ink">Registrations that need a human touch</h2><p className="mt-2 text-sm leading-6 text-bfb-ink/65">Email supporters, open team links, and update paid/exported status from one place.</p></div></div>
      <div className="mt-6 divide-y divide-bfb-ink/10">
        {followUps.length === 0 ? <p className="rounded-sm bg-bfb-green/15 p-4 text-sm font-bold text-bfb-ink">No follow-ups right now. Beautiful little admin miracle.</p> : followUps.map((registration) => (<div key={registration.id} className="py-4"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="font-heading text-lg font-black text-bfb-ink">{registration.organization || buyerName(registration)}</p><p className="mt-1 text-sm leading-6 text-bfb-ink/65">{registration.packageName} · {registration.buyerEmail}</p></div><div className="flex flex-wrap gap-2">{needsPaymentFollowUp(registration) ? <StatusPill tone="warning">Payment</StatusPill> : null}{needsBowlerFollowUp(registration) ? <StatusPill tone="warning">Bowlers</StatusPill> : null}{needsExportFollowUp(registration) ? <StatusPill>Export</StatusPill> : null}</div></div><p className="mt-3 text-sm leading-6 text-bfb-ink/65">Confirmation: <strong>{registration.id}</strong> · Amount: <strong>{formatMoney(registration.grandTotal)}</strong>{registration.sessionName ? <> · Session: <strong>{registration.sessionName}</strong></> : null}</p><ActionButtons registration={registration} /></div>))}
      </div>
    </section>
  );
}

function RegistrationsTable({ registrations }: { registrations: BowlingRegistrationRecord[] }) {
  return (
    <section className="rounded-sm border border-bfb-ink/10 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="bfb-eyebrow">All registrations</p><h2 className="mt-2 font-heading text-2xl font-black text-bfb-ink">Registration view</h2><p className="mt-2 text-sm leading-6 text-bfb-ink/65">A full readout with quick actions for follow-up, payment, team links, and export tracking.</p></div><Link href="/api/bowling/export" className="bfb-secondary inline-flex items-center gap-2"><Download aria-hidden="true" size={16} />Export CSV</Link></div>
      <div className="mt-6 overflow-x-auto"><table className="min-w-full border-collapse text-left text-sm"><thead><tr className="border-b border-bfb-ink/10 text-xs uppercase tracking-wide text-bfb-ink/50"><th className="py-3 pr-4 font-bold">Name</th><th className="py-3 pr-4 font-bold">Type</th><th className="py-3 pr-4 font-bold">Amount</th><th className="py-3 pr-4 font-bold">Payment</th><th className="py-3 pr-4 font-bold">Export</th><th className="py-3 pr-4 font-bold">Bowlers</th><th className="py-3 pr-4 font-bold">Created</th><th className="py-3 pr-4 font-bold">Actions</th></tr></thead><tbody className="divide-y divide-bfb-ink/10">{registrations.map((registration) => (<tr key={registration.id}><td className="py-4 pr-4 align-top"><p className="font-bold text-bfb-ink">{registration.organization || buyerName(registration)}</p><p className="mt-1 text-xs text-bfb-ink/60">{registration.buyerEmail}</p><p className="mt-1 text-xs text-bfb-ink/50">{registration.id}</p></td><td className="py-4 pr-4 align-top text-bfb-ink/75">{registration.packageName}</td><td className="py-4 pr-4 align-top font-bold text-bfb-ink">{formatMoney(registration.grandTotal)}</td><td className="py-4 pr-4 align-top"><StatusPill tone={registration.paymentStatus === "paid" ? "good" : "warning"}>{registration.paymentStatus.replace(/_/g, " ")}</StatusPill></td><td className="py-4 pr-4 align-top"><StatusPill tone={registration.exportStatus === "exported" ? "good" : "neutral"}>{registration.exportStatus.replace(/_/g, " ")}</StatusPill></td><td className="py-4 pr-4 align-top text-bfb-ink/75">{registration.laneCount > 0 ? `${completedBowlers(registration)} / ${bowlingEventConfig.teamSize}` : "—"}</td><td className="py-4 pr-4 align-top text-bfb-ink/65">{formatDate(registration.createdAt)}</td><td className="py-4 pr-4 align-top"><ActionButtons registration={registration} /></td></tr>))}</tbody></table></div>
    </section>
  );
}

export default async function BowlingAdminPage() {
  const isAuthed = await isBowlingAdminAuthenticated();
  if (!isAuthed) redirect("/bowling-for-backpacks/admin/login");

  const configured = isBowlingDatabaseConfigured();
  const registrations = (await listBowlingRegistrations()) ?? [];
  const totalRevenue = registrations.reduce((sum, registration) => sum + registration.grandTotal, 0);
  const totalLanes = registrations.reduce((sum, registration) => sum + registration.laneCount, 0);
  const missingBowlers = registrations.filter(needsBowlerFollowUp).length;
  const paymentFollowUps = registrations.filter(needsPaymentFollowUp).length;

  return (
    <main className="min-h-screen bg-bfb-cream py-10"><div className="bfb-shell"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="bfb-eyebrow">City Center event admin</p><h1 className="mt-3 font-heading text-4xl font-black leading-tight text-bfb-ink sm:text-5xl">Bowling for Backpacks dashboard</h1><p className="mt-4 max-w-3xl text-base leading-7 text-bfb-ink/70">A simple command center for registrations, payments, bowler follow-up, and export readiness.</p></div><Link href="/bowling-for-backpacks" className="bfb-secondary">View event page</Link></div>{!configured ? <div className="mt-8 rounded-sm border border-yellow-300 bg-yellow-50 p-5 text-yellow-950"><p className="font-heading text-lg font-black">Database not connected yet</p><p className="mt-2 text-sm leading-6">Supabase environment variables are not configured, so this dashboard will be empty until production data is connected.</p></div> : null}<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard label="Registrations" value={String(registrations.length)} helper="Total records received." /><StatCard label="Projected revenue" value={formatMoney(totalRevenue)} helper="Includes teams, sponsors, lanes, and gifts." /><StatCard label="Lanes reserved" value={String(totalLanes)} helper="Across both bowling sessions." /><StatCard label="Needs follow-up" value={String(paymentFollowUps + missingBowlers)} helper="Payment or bowler details to resolve." /></div><div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-sm bg-bfb-navy p-5 text-white"><CreditCard aria-hidden="true" size={24} /><p className="mt-4 font-heading text-xl font-black">Payment follow-up</p><p className="mt-2 text-sm leading-6 text-white/75">{paymentFollowUps} registration(s) need payment confirmation, invoice, or check follow-up.</p></div><div className="rounded-sm bg-bfb-blue p-5 text-white"><UsersRound aria-hidden="true" size={24} /><p className="mt-4 font-heading text-xl font-black">Bowler follow-up</p><p className="mt-2 text-sm leading-6 text-white/80">{missingBowlers} team(s) still need bowler names completed.</p></div><div className="rounded-sm bg-white p-5 text-bfb-ink shadow-sm"><Mail aria-hidden="true" className="text-bfb-green" size={24} /><p className="mt-4 font-heading text-xl font-black">Contact</p><p className="mt-2 text-sm leading-6 text-bfb-ink/65">Primary event contact: {bowlingEventConfig.contactName}</p></div></div><div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]"><FollowUpList registrations={registrations} /><RegistrationsTable registrations={registrations} /></div></div></main>
  );
}
