import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle, CreditCard, Download, ExternalLink, Mail, UsersRound } from "lucide-react";
import { BowlingAdminActionButton } from "@/components/bowling/BowlingAdminActionButton";
import { isBowlingAdminAuthenticated } from "@/lib/bowling/admin-auth";
import { bowlingEventConfig } from "@/lib/bowling/config";
import { isBowlingDatabaseConfigured, listBowlingRegistrations } from "@/lib/bowling/database";
import { committedBowlingRegistrations, isCommittedBowlingRegistration } from "@/lib/bowling/records";
import type { BowlingRegistrationRecord } from "@/lib/bowling/types";
import { getsTeamManagementLink } from "@/lib/bowling/validation";

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
  isCommittedBowlingRegistration(registration) &&
  getsTeamManagementLink(registration.registrationType) &&
  completedBowlers(registration) < bowlingEventConfig.teamSize;

const needsPaymentFollowUp = (registration: BowlingRegistrationRecord) =>
  registration.paymentStatus === "invoice_requested" || registration.paymentStatus === "check_pledged";
const needsExportFollowUp = (registration: BowlingRegistrationRecord) =>
  isCommittedBowlingRegistration(registration) && registration.exportStatus !== "exported";
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
    <div className="ops-card p-5">
      <p className="text-sm font-bold uppercase tracking-wide text-cc-dark-blue/55">{label}</p>
      <p className="mt-3 font-heading text-3xl font-bold text-cc-dark-blue">{value}</p>
      <p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">{helper}</p>
    </div>
  );
}

function StatusPill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "good" | "warning" | "neutral" }) {
  const toneClass =
    tone === "good"
      ? "bg-cc-light-green/20 text-cc-navy"
      : tone === "warning"
        ? "bg-yellow-100 text-yellow-900"
        : "bg-cc-light-blue/70 text-cc-navy";
  return <span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${toneClass}`}>{children}</span>;
}

function ActionButtons({ registration }: { registration: BowlingRegistrationRecord }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <a href={mailtoForRegistration(registration)} className="inline-flex items-center gap-2 rounded-sm bg-cc-navy px-3 py-2 font-heading text-xs font-bold uppercase text-white transition hover:bg-cc-sky-blue"><Mail aria-hidden="true" size={14} />Email</a>
      {getsTeamManagementLink(registration.registrationType) ? <Link href={teamLink(registration)} className="inline-flex items-center gap-2 rounded-sm border border-cc-navy/10 bg-white px-3 py-2 font-heading text-xs font-bold uppercase text-cc-navy transition hover:border-cc-sky-blue"><ExternalLink aria-hidden="true" size={14} />Team link</Link> : null}
      {registration.paymentStatus !== "paid" ? <BowlingAdminActionButton registrationId={registration.id} action="mark-paid" label="Mark paid" /> : null}
      {registration.exportStatus !== "exported" ? <BowlingAdminActionButton registrationId={registration.id} action="mark-exported" label="Mark exported" /> : null}
    </div>
  );
}

function FollowUpList({ registrations }: { registrations: BowlingRegistrationRecord[] }) {
  const followUps = registrations.filter((registration) => needsBowlerFollowUp(registration) || needsPaymentFollowUp(registration) || needsExportFollowUp(registration));
  return (
    <section className="ops-card p-6 shadow-soft">
      <div className="flex items-start gap-3"><AlertCircle aria-hidden="true" className="mt-1 text-cc-sky-blue" size={22} /><div><p className="ops-eyebrow">Follow-up queue</p><h2 className="mt-2 font-heading text-2xl font-bold text-cc-dark-blue">Registrations that need a human touch</h2><p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">Email supporters, open team links when available, and update paid/exported status from one place.</p></div></div>
      <div className="mt-6 divide-y divide-cc-navy/10">
        {followUps.length === 0 ? <p className="rounded-sm bg-cc-light-green/15 p-4 text-sm font-bold text-cc-dark-blue">No follow-ups right now.</p> : followUps.map((registration) => (<div key={registration.id} className="py-4"><div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"><div><p className="font-heading text-lg font-bold text-cc-dark-blue">{registration.organization || buyerName(registration)}</p><p className="mt-1 text-sm leading-6 text-cc-dark-blue/65">{registration.packageName} · {registration.buyerEmail}</p></div><div className="flex flex-wrap gap-2">{needsPaymentFollowUp(registration) ? <StatusPill tone="warning">Payment</StatusPill> : null}{needsBowlerFollowUp(registration) ? <StatusPill tone="warning">Bowlers</StatusPill> : null}{needsExportFollowUp(registration) ? <StatusPill>Export</StatusPill> : null}</div></div><p className="mt-3 text-sm leading-6 text-cc-dark-blue/65">Confirmation: <strong>{registration.id}</strong> · Amount: <strong>{formatMoney(registration.grandTotal)}</strong>{registration.sessionName ? <> · Session: <strong>{registration.sessionName}</strong></> : null}</p><ActionButtons registration={registration} /></div>))}
      </div>
    </section>
  );
}

function RegistrationsTable({ registrations }: { registrations: BowlingRegistrationRecord[] }) {
  return (
    <section className="ops-card p-6 shadow-soft">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="ops-eyebrow">All registrations</p><h2 className="mt-2 font-heading text-2xl font-bold text-cc-dark-blue">Registration view</h2><p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">A full readout with quick actions for follow-up, payment, team links when available, and export tracking.</p></div><Link href="/api/bowling/export" className="ops-secondary inline-flex items-center gap-2"><Download aria-hidden="true" size={16} />Export CSV</Link></div>
      <div className="mt-6 overflow-x-auto"><table className="min-w-full border-collapse text-left text-sm"><thead><tr className="border-b border-cc-navy/10 text-xs uppercase tracking-wide text-cc-dark-blue/55"><th className="py-3 pr-4 font-bold">Name</th><th className="py-3 pr-4 font-bold">Type</th><th className="py-3 pr-4 font-bold">Amount</th><th className="py-3 pr-4 font-bold">Payment</th><th className="py-3 pr-4 font-bold">Export</th><th className="py-3 pr-4 font-bold">Bowlers</th><th className="py-3 pr-4 font-bold">Created</th><th className="py-3 pr-4 font-bold">Actions</th></tr></thead><tbody className="divide-y divide-cc-navy/10">{registrations.map((registration) => (<tr key={registration.id}><td className="py-4 pr-4 align-top"><p className="font-bold text-cc-dark-blue">{registration.organization || buyerName(registration)}</p><p className="mt-1 text-xs text-cc-dark-blue/60">{registration.buyerEmail}</p><p className="mt-1 text-xs text-cc-dark-blue/50">{registration.id}</p></td><td className="py-4 pr-4 align-top text-cc-dark-blue/75">{registration.packageName}</td><td className="py-4 pr-4 align-top font-bold text-cc-dark-blue">{isCommittedBowlingRegistration(registration) ? formatMoney(registration.grandTotal) : "Not counted"}</td><td className="py-4 pr-4 align-top"><StatusPill tone={registration.paymentStatus === "paid" ? "good" : "warning"}>{registration.paymentStatus.replace(/_/g, " ")}</StatusPill></td><td className="py-4 pr-4 align-top"><StatusPill tone={registration.exportStatus === "exported" ? "good" : "neutral"}>{registration.exportStatus.replace(/_/g, " ")}</StatusPill></td><td className="py-4 pr-4 align-top text-cc-dark-blue/75">{getsTeamManagementLink(registration.registrationType) ? `${completedBowlers(registration)} / ${bowlingEventConfig.teamSize}` : "—"}</td><td className="py-4 pr-4 align-top text-cc-dark-blue/65">{formatDate(registration.createdAt)}</td><td className="py-4 pr-4 align-top"><ActionButtons registration={registration} /></td></tr>))}</tbody></table></div>
    </section>
  );
}

export default async function BowlingAdminPage() {
  const isAuthed = await isBowlingAdminAuthenticated();
  if (!isAuthed) redirect("/bowling-for-backpacks/admin/login");

  const configured = isBowlingDatabaseConfigured();
  const registrations = (await listBowlingRegistrations()) ?? [];
  const committedRegistrations = committedBowlingRegistrations(registrations);
  const totalRevenue = committedRegistrations.reduce((sum, registration) => sum + registration.grandTotal, 0);
  const totalTeamSpots = committedRegistrations.reduce((sum, registration) => sum + registration.laneCount, 0);
  const missingBowlers = committedRegistrations.filter(needsBowlerFollowUp).length;
  const paymentFollowUps = committedRegistrations.filter(needsPaymentFollowUp).length;

  return (
    <main className="min-h-screen bg-cc-light-blue/35 py-10"><div className="ops-shell"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="ops-eyebrow">City Center event admin</p><h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-cc-dark-blue sm:text-5xl">Bowling for Backpacks dashboard</h1><p className="mt-4 max-w-3xl text-base leading-7 text-cc-dark-blue/70">A simple command center for registrations, payments, bowler follow-up, and export readiness.</p></div><Link href="/bowling-for-backpacks" className="ops-secondary">View event page</Link></div>{!configured ? <div className="mt-8 rounded-sm border border-yellow-300 bg-yellow-50 p-5 text-yellow-950"><p className="font-heading text-lg font-bold">Database not connected yet</p><p className="mt-2 text-sm leading-6">Supabase environment variables are not configured, so this dashboard will be empty until production data is connected.</p></div> : null}<div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4"><StatCard label="Committed records" value={String(committedRegistrations.length)} helper="Paid, invoice, and check commitments." /><StatCard label="Projected revenue" value={formatMoney(totalRevenue)} helper="Excludes abandoned card checkouts." /><StatCard label="Team spots reserved" value={String(totalTeamSpots)} helper="Across both bowling sessions." /><StatCard label="Needs follow-up" value={String(paymentFollowUps + missingBowlers)} helper="Invoice, check, or bowler details to resolve." /></div><div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-sm bg-cc-navy p-5 text-white"><CreditCard aria-hidden="true" size={24} /><p className="mt-4 font-heading text-xl font-bold">Payment follow-up</p><p className="mt-2 text-sm leading-6 text-white/75">{paymentFollowUps} registration(s) need invoice or check follow-up.</p></div><div className="rounded-sm bg-cc-sky-blue p-5 text-white"><UsersRound aria-hidden="true" size={24} /><p className="mt-4 font-heading text-xl font-bold">Bowler follow-up</p><p className="mt-2 text-sm leading-6 text-white/80">{missingBowlers} team(s) still need bowler names completed.</p></div><div className="rounded-sm bg-white p-5 text-cc-dark-blue shadow-sm"><Mail aria-hidden="true" className="text-cc-light-green" size={24} /><p className="mt-4 font-heading text-xl font-bold">Contact</p><p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">Primary event contact: {bowlingEventConfig.contactName}</p></div></div><div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]"><FollowUpList registrations={registrations} /><RegistrationsTable registrations={registrations} /></div></div></main>
  );
}
