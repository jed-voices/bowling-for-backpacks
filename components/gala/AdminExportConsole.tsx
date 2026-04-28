"use client";

import { useMemo, useState } from "react";
import { Download, Search, ShieldCheck } from "lucide-react";
import { sampleRegistrations } from "@/lib/gala/config";
import type { ExportStatus, PaymentStatus } from "@/lib/gala/types";
import { formatCurrency } from "@/lib/gala/validation";

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  invoice_requested: "Invoice requested",
  check_pledged: "Check pledged",
};

const exportStatusLabels: Record<ExportStatus, string> = {
  not_exported: "Not exported",
  exported: "Exported",
  needs_review: "Needs review",
};

const exportLinks = [
  {
    label: "Sales Import",
    href: "/api/gala/admin/exports/greater-giving-sales",
  },
  {
    label: "Supporter Import",
    href: "/api/gala/admin/exports/greater-giving-supporters",
  },
  {
    label: "Drawing Entries",
    href: "/api/gala/admin/exports/chance-to-win",
  },
  {
    label: "Donor Export",
    href: "/api/gala/admin/exports/bloomerang-transactions",
  },
  {
    label: "Raw Data",
    href: "/api/gala/admin/exports/backend-json",
  },
];

type AdminExportConsoleProps = {
  exportKey?: string;
};

export function AdminExportConsole({ exportKey }: AdminExportConsoleProps) {
  const [query, setQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const registrations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sampleRegistrations.filter((registration) => {
      const matchesQuery = normalizedQuery
        ? [
            registration.buyerFirstName,
            registration.buyerLastName,
            registration.buyerEmail,
            registration.organization,
            registration.packageName,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true;

      const matchesPayment =
        paymentFilter === "all" || registration.paymentStatus === paymentFilter;

      return matchesQuery && matchesPayment;
    });
  }, [paymentFilter, query]);

  const totalValue = registrations.reduce(
    (sum, registration) => sum + registration.grandTotal,
    0,
  );
  const totalSeats = registrations.reduce((sum, registration) => sum + registration.seats, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Registrations" value={registrations.length.toString()} />
        <Metric label="Seats" value={totalSeats.toString()} />
        <Metric label="Visible value" value={formatCurrency(totalValue)} />
      </div>

      <section className="ops-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-cc-dark-blue">
              Registration preview
            </h2>
            <p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">
              Static preview data is shown until Supabase is connected.
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
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-y border-cc-navy/10 text-xs uppercase text-cc-dark-blue/55">
                <th className="py-3 pr-4 font-heading">Buyer</th>
                <th className="py-3 pr-4 font-heading">Package</th>
                <th className="py-3 pr-4 font-heading">Payment</th>
                <th className="py-3 pr-4 font-heading">Export</th>
                <th className="py-3 pr-4 font-heading">Guests</th>
                <th className="py-3 pr-4 font-heading">Seats</th>
                <th className="py-3 pr-4 font-heading">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cc-navy/10">
              {registrations.map((registration) => {
                const completedGuests = registration.guests.filter(
                  (guest) => guest.firstName || guest.lastName,
                ).length;

                return (
                  <tr key={registration.id}>
                    <td className="py-4 pr-4 align-top">
                      <p className="font-semibold text-cc-dark-blue">
                        {registration.buyerFirstName} {registration.buyerLastName}
                      </p>
                      <p className="mt-1 text-cc-dark-blue/60">{registration.buyerEmail}</p>
                      <p className="mt-1 text-cc-dark-blue/60">{registration.organization}</p>
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <p className="font-semibold text-cc-dark-blue">{registration.packageName}</p>
                      <p className="mt-1 text-cc-dark-blue/60">
                        {registration.greaterGivingPackageNumber}
                      </p>
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <StatusPill tone="blue">
                        {paymentStatusLabels[registration.paymentStatus]}
                      </StatusPill>
                    </td>
                    <td className="py-4 pr-4 align-top">
                      <StatusPill tone={registration.exportStatus === "needs_review" ? "gold" : "green"}>
                        {exportStatusLabels[registration.exportStatus]}
                      </StatusPill>
                    </td>
                    <td className="py-4 pr-4 align-top">
                      {completedGuests}/{registration.seats}
                    </td>
                    <td className="py-4 pr-4 align-top">{registration.seats}</td>
                    <td className="py-4 pr-4 align-top font-semibold">
                      {formatCurrency(registration.grandTotal)}
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
            <h2 className="font-heading text-xl font-bold text-cc-dark-blue">
              Export console
            </h2>
            <p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">
              These routes currently export preview records through the same utility
              functions that will be used after Supabase is connected.
            </p>
          </div>
          <ShieldCheck aria-hidden="true" className="hidden text-cc-light-green lg:block" size={30} />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
      <p className="text-sm font-semibold uppercase text-cc-dark-blue/55">{label}</p>
      <p className="mt-3 font-heading text-3xl font-bold text-cc-dark-blue">{value}</p>
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
    <span className={`inline-flex rounded-sm px-2.5 py-1 text-xs font-semibold ${classes[tone]}`}>
      {children}
    </span>
  );
}
