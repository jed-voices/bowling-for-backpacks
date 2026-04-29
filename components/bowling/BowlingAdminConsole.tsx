"use client";

import { useMemo, useState } from "react";
import { Download, Search, ShieldCheck } from "lucide-react";
import { bowlingSessions } from "@/lib/bowling/config";
import type {
  BowlingExportStatus,
  BowlingPaymentStatus,
  BowlingRegistrationRecord,
} from "@/lib/bowling/types";
import {
  committedBowlingRegistrations,
  giftOnlyRegistrations,
  isCommittedBowlingRegistration,
} from "@/lib/bowling/records";
import {
  formatCurrency,
  remainingLanes,
  remainingLanesFromRegistrations,
} from "@/lib/bowling/validation";

type BowlingAdminConsoleProps = {
  exportKey?: string;
  registrations: BowlingRegistrationRecord[];
  dataSource: "live" | "preview";
};

const paymentStatusLabels: Record<BowlingPaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  invoice_requested: "Invoice requested",
  check_pledged: "Check pledged",
};

const exportStatusLabels: Record<BowlingExportStatus, string> = {
  not_exported: "Not exported",
  exported: "Exported",
  needs_review: "Needs review",
};

const exportLinks = [
  {
    label: "Donor Export",
    href: "/api/bowling/admin/exports/bloomerang-transactions",
  },
  {
    label: "Ops List",
    href: "/api/bowling/admin/exports/operations",
  },
  {
    label: "Raw Data",
    href: "/api/bowling/admin/exports/backend-json",
  },
];

export function BowlingAdminConsole({
  exportKey,
  registrations: sourceRegistrations,
  dataSource,
}: BowlingAdminConsoleProps) {
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const committedSourceRegistrations = useMemo(
    () => committedBowlingRegistrations(sourceRegistrations),
    [sourceRegistrations],
  );

  const registrations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sourceRegistrations.filter((registration) => {
      const matchesQuery = normalizedQuery
        ? [
            registration.buyerFirstName,
            registration.buyerLastName,
            registration.buyerEmail,
            registration.organization,
            registration.teamName,
            registration.packageName,
            registration.sessionName,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      const matchesPayment =
        paymentFilter === "all" || registration.paymentStatus === paymentFilter;

      return matchesQuery && matchesPayment;
    });
  }, [paymentFilter, query, sourceRegistrations]);

  const committedRegistrations = useMemo(
    () => registrations.filter(isCommittedBowlingRegistration),
    [registrations],
  );

  const teamRegistrations = committedRegistrations.filter(
    (registration) =>
      registration.registrationType === "team" || registration.registrationType === "sponsorship",
  );
  const totalTeamRevenue = committedRegistrations
    .filter((registration) => registration.registrationType === "team")
    .reduce((sum, registration) => sum + registration.subtotal, 0);
  const sponsorshipRevenue = committedRegistrations
    .filter(
      (registration) =>
        registration.registrationType === "sponsorship" ||
        registration.registrationType === "lane-sponsor",
    )
    .reduce((sum, registration) => sum + registration.subtotal, 0);
  const giftOnlyTotal = giftOnlyRegistrations(committedRegistrations).reduce(
    (sum, registration) => sum + registration.donationTotal,
    0,
  );
  const totalGifts = committedRegistrations.reduce(
    (sum, registration) => sum + registration.donationTotal,
    0,
  );
  const grandTotal = committedRegistrations.reduce(
    (sum, registration) => sum + registration.grandTotal,
    0,
  );
  const followUp = committedRegistrations.filter(
    (registration) =>
      registration.paymentStatus === "invoice_requested" ||
      registration.paymentStatus === "check_pledged" ||
      ((registration.registrationType === "sponsorship" ||
        registration.registrationType === "lane-sponsor") &&
        !registration.sponsorLogoName),
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Committed records" value={committedRegistrations.length.toString()} />
        <Metric label="Teams registered" value={teamRegistrations.length.toString()} />
        <Metric label="Sponsorship revenue" value={formatCurrency(sponsorshipRevenue)} />
        <Metric label="Grand total" value={formatCurrency(grandTotal)} />
        <Metric label="Team revenue" value={formatCurrency(totalTeamRevenue)} />
        <Metric label="Total gifts" value={formatCurrency(totalGifts)} />
        <Metric label="Gift-only pool" value={formatCurrency(giftOnlyTotal)} />
        <Metric label="Records needing follow-up" value={followUp.toString()} />
        <Metric
          label="Lanes remaining"
          value={bowlingSessions
            .map((session) => {
              const remaining =
                dataSource === "live"
                  ? remainingLanesFromRegistrations(session.id, committedSourceRegistrations)
                  : remainingLanes(session.id);

              return `${session.name}: ${remaining}`;
            })
            .join(" / ")}
        />
      </div>

      <section className="ops-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-cc-dark-blue">
              {dataSource === "live" ? "Live registrations" : "Registration preview"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">
              {dataSource === "live"
                ? "Supabase registrations are shown for planning, reconciliation, and export checks."
                : "Preview registrations are shown for planning, reconciliation, and export checks."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <span className="sr-only">Search registrations</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cc-dark-blue/35"
                size={17}
              />
              <input
                className="ops-field w-full pl-10 sm:w-72"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
              />
            </label>
            <label>
              <span className="sr-only">Filter payment status</span>
              <select
                className="ops-field"
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
              >
                <option value="all">All payment statuses</option>
                {Object.entries(paymentStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-cc-navy/10 text-xs uppercase text-cc-dark-blue/55">
                <th className="py-3 pr-4 font-heading">Buyer</th>
                <th className="py-3 pr-4 font-heading">Type</th>
                <th className="py-3 pr-4 font-heading">Session</th>
                <th className="py-3 pr-4 font-heading">Payment</th>
                <th className="py-3 pr-4 font-heading">Logo</th>
                <th className="py-3 pr-4 font-heading">Bowlers</th>
                <th className="py-3 pr-4 font-heading">Export</th>
                <th className="py-3 pr-4 font-heading">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cc-navy/10">
              {registrations.map((registration) => {
                const bowlerCount = registration.bowlers.filter(
                  (bowler) => bowler.firstName || bowler.lastName,
                ).length;

                return (
                  <tr key={registration.id}>
                    <td className="py-4 pr-4 align-top">
                      <p className="font-bold text-cc-dark-blue">
                        {registration.buyerFirstName} {registration.buyerLastName}
                      </p>
                      <p className="mt-1 text-cc-dark-blue/60">{registration.buyerEmail}</p>
                      <p className="mt-1 text-cc-dark-blue/60">{registration.organization}</p>
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <p className="font-bold text-cc-dark-blue">{registration.packageName}</p>
                      <p className="mt-1 text-cc-dark-blue/60">{registration.teamName || "No team"}</p>
                    </td>
                    <td className="py-4 pr-4 align-top">{registration.sessionName || "None"}</td>
                    <td className="py-4 pr-4 align-top">
                      <StatusPill tone="blue">
                        {paymentStatusLabels[registration.paymentStatus]}
                      </StatusPill>
                    </td>
                    <td className="py-4 pr-4 align-top">
                      {registration.sponsorLogoName ? "Received" : "Missing"}
                    </td>
                    <td className="py-4 pr-4 align-top">
                      {registration.laneCount > 0 ? `${bowlerCount}/6` : "N/A"}
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <StatusPill tone={registration.exportStatus === "needs_review" ? "gold" : "green"}>
                        {exportStatusLabels[registration.exportStatus]}
                      </StatusPill>
                    </td>
                    <td className="py-4 pr-4 align-top font-bold">
                      {isCommittedBowlingRegistration(registration)
                        ? formatCurrency(registration.grandTotal)
                        : "Not counted"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ops-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-cc-dark-blue">Export console</h2>
            <p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">
              {dataSource === "live"
                ? "Exports are generated from live Supabase registrations."
                : "Preview exports use the same utility functions that will support live data later."}
            </p>
          </div>
          <ShieldCheck aria-hidden="true" className="hidden text-cc-light-green lg:block" size={30} />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {exportLinks.map((link) => {
            const href = exportKey
              ? `${link.href}?key=${encodeURIComponent(exportKey)}`
              : link.href;

            return (
              <a key={link.href} href={href} className="ops-secondary justify-between">
                {link.label}
                <Download aria-hidden="true" size={16} />
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="ops-card p-5">
      <p className="text-sm font-bold uppercase text-cc-dark-blue/55">{label}</p>
      <p className="mt-3 font-heading text-2xl font-bold leading-tight text-cc-dark-blue">{value}</p>
    </div>
  );
}

function StatusPill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "blue" | "green" | "gold";
}) {
  const classes = {
    blue: "bg-cc-sky-blue/15 text-cc-navy",
    green: "bg-cc-light-green/20 text-cc-navy",
    gold: "bg-cc-light-blue/70 text-cc-navy",
  };

  return (
    <span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-bold ${classes[tone]}`}>
      {children}
    </span>
  );
}
