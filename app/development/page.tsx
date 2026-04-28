import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  ClipboardList,
  Database,
  Download,
  Home,
  ListChecks,
  LockKeyhole,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import {
  isDevelopmentAuthConfigured,
  isDevelopmentAuthenticated,
  isUsingLocalDevelopmentCredentials,
  LOCAL_DEVELOPMENT_PASSWORD,
  LOCAL_DEVELOPMENT_USERNAME,
  signOutDevelopmentUser,
} from "@/lib/events/development-auth";
import { cityCenterEvents } from "@/lib/events/directory";
import {
  formatCurrency,
  getDevelopmentDashboard,
  type EventOperationsSummary,
} from "@/lib/events/dashboard";

export const metadata: Metadata = {
  title: "Development | OK City Center Events",
  description:
    "Development access and event operations dashboard for City Center events.",
};

type DevelopmentPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DevelopmentPage({
  searchParams,
}: DevelopmentPageProps) {
  const params = (await searchParams) ?? {};
  const hasError = params.error === "1";
  const isConfigured = isDevelopmentAuthConfigured();
  const isAuthenticated = await isDevelopmentAuthenticated();
  const useLocalCredentials = isUsingLocalDevelopmentCredentials();

  async function logout() {
    "use server";

    await signOutDevelopmentUser();
    redirect("/development");
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-cc-light-blue font-body text-cc-dark-blue">
        <header className="section-shell py-5">
          <nav className="flex items-center justify-between gap-4 border-b border-cc-navy/10 pb-4 text-sm text-cc-navy/70">
            <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold uppercase transition hover:text-cc-dark-blue">
              <Home aria-hidden="true" size={15} />
              City Center Events
            </Link>
            <Link href="/supporters" className="transition hover:text-cc-dark-blue">
              Supporters
            </Link>
          </nav>
        </header>

        <section className="section-shell grid gap-8 pb-12 pt-3 lg:grid-cols-[minmax(0,0.86fr)_minmax(340px,0.54fr)] lg:gap-12 lg:pb-16 lg:pt-12">
          <div className="max-w-3xl">
            <p className="font-heading text-xs font-bold uppercase leading-none text-cc-navy">
              Development access
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold leading-[1.04] text-cc-dark-blue sm:text-5xl lg:text-6xl">
              Event data and follow-up, in one place.
            </h1>
            <p className="mt-5 text-base leading-7 text-cc-dark-blue/75 sm:text-lg">
              This is the staff side of the events platform. Once inside,
              development can move between dashboards, exports, registration
              reviews, and readiness checks.
            </p>
            <div className="mt-8 hidden gap-4 sm:grid sm:grid-cols-3">
              <Signal label="Events" value={cityCenterEvents.length.toString()} />
              <Signal label="Gateway" value="Live" />
              <Signal label="Role" value="Development" />
            </div>
          </div>

          <form
            action="/api/development/login"
            method="post"
            className="rounded-sm border border-cc-navy/10 bg-white p-6 shadow-sm sm:p-7"
          >
            <LockKeyhole aria-hidden="true" className="text-cc-sky-blue" size={34} />
            <h2 className="mt-5 font-heading text-2xl font-bold text-cc-dark-blue">
              Development access
            </h2>
            <p className="mt-3 text-sm leading-6 text-cc-dark-blue/65">
              Use the development username and password. The current build can
              still use environment credentials until a full user account layer
              is added.
            </p>
            {useLocalCredentials ? (
              <p className="mt-5 border border-cc-light-green/40 bg-cc-light-green/10 p-3 text-sm leading-6 text-cc-dark-blue/75">
                Local development credentials are enabled for this build. Use{" "}
                <strong>{LOCAL_DEVELOPMENT_USERNAME}</strong> with{" "}
                <strong>{LOCAL_DEVELOPMENT_PASSWORD}</strong>.
              </p>
            ) : null}
            {!isConfigured ? (
              <p className="mt-5 border border-cc-sky-blue/30 bg-cc-light-blue/60 p-3 text-sm leading-6 text-cc-dark-blue/75">
                No development credentials are configured yet.
              </p>
            ) : null}
            {hasError ? (
              <p className="mt-5 border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700">
                That username or password did not match. Please try again.
              </p>
            ) : null}
            <label className="mt-6 block">
              <span className="mb-2 block font-heading text-sm font-semibold text-cc-dark-blue">
                Username
              </span>
              <input
                name="username"
                type="text"
                className="min-h-12 w-full rounded-sm border border-cc-navy/15 bg-white px-3 py-2 text-base text-cc-dark-blue shadow-sm transition placeholder:text-cc-dark-blue/35 focus:border-cc-sky-blue focus:outline-none focus:ring-2 focus:ring-cc-light-green/35"
                autoComplete="username"
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block font-heading text-sm font-semibold text-cc-dark-blue">
                Password
              </span>
              <input
                name="password"
                type="password"
                className="min-h-12 w-full rounded-sm border border-cc-navy/15 bg-white px-3 py-2 text-base text-cc-dark-blue shadow-sm transition placeholder:text-cc-dark-blue/35 focus:border-cc-sky-blue focus:outline-none focus:ring-2 focus:ring-cc-light-green/35"
                autoComplete="current-password"
              />
            </label>
            <button
              className="mt-5 inline-flex items-center gap-2 font-heading text-sm font-bold uppercase text-cc-navy underline decoration-cc-light-green decoration-2 underline-offset-8 transition hover:text-cc-dark-blue disabled:cursor-not-allowed disabled:text-cc-dark-blue/40"
              disabled={!isConfigured}
              type="submit"
            >
              Enter dashboard
              <ArrowRight aria-hidden="true" size={16} />
            </button>
            <Link
              href="/"
              className="mt-6 block text-sm leading-6 text-cc-dark-blue/60 transition hover:text-cc-dark-blue"
            >
              Back to gateway
            </Link>
          </form>

          <div className="grid gap-4 sm:hidden">
            <Signal label="Events" value={cityCenterEvents.length.toString()} />
            <Signal label="Gateway" value="Live" />
            <Signal label="Role" value="Development" />
          </div>
        </section>
      </main>
    );
  }

  const dashboard = await getDevelopmentDashboard();

  return (
    <main className="min-h-screen bg-cc-light-blue font-body text-cc-dark-blue">
      <header className="section-shell pt-5">
        <nav className="flex items-center justify-between gap-4 border-b border-cc-navy/10 pb-4 text-sm text-cc-navy/70">
          <Link href="/" className="inline-flex items-center gap-2 font-heading font-bold uppercase transition hover:text-cc-dark-blue">
            <Home aria-hidden="true" size={15} />
            City Center Events
          </Link>
          <Link href="/supporters" className="transition hover:text-cc-dark-blue">
            Supporters
          </Link>
        </nav>
      </header>

      <section className="mt-5 border-y border-cc-navy/10 bg-cc-dark-blue text-white">
        <div className="section-shell flex flex-col gap-5 py-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-heading text-xs font-bold uppercase leading-none text-cc-light-green">
              Development dashboard
            </p>
            <h1 className="mt-3 font-heading text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              CITY CENTER EVENT DESK
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
              Customized for City Center Development, this workflow makes it
              easy to track event registrations, income, follow-up needs, and
              Bloomerang/Greater Giving exports.
            </p>
          </div>
          <form action={logout}>
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-cc-light-green">
              Sign out
              <LogOut aria-hidden="true" size={16} />
            </button>
          </form>
        </div>
      </section>

      <section className="section-shell pb-16 pt-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Signal label="Events" value={dashboard.totalEvents.toString()} />
          <Signal
            label="Registrations"
            value={dashboard.totalRegistrations.toString()}
          />
          <Signal
            label="Visible value"
            value={formatCurrency(dashboard.totalValue)}
          />
          <Signal
            label="Follow-up queue"
            value={(dashboard.totalOpenPayments + dashboard.totalExportQueue).toString()}
          />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {dashboard.events.map((event) => (
            <EventOperationsCard key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.58fr)]">
          <FollowUpQueue events={dashboard.events} />
          <ExportHub events={dashboard.events} />
        </div>
      </section>
    </main>
  );
}

function Signal({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-cc-navy/10 border-l-4 border-l-cc-light-green bg-white p-5 shadow-sm">
      <p className="font-heading text-xs font-bold uppercase text-cc-navy/60">{label}</p>
      <p className="mt-2 font-heading text-2xl font-bold text-cc-dark-blue">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: "registering" | "building" }) {
  const label = status === "registering" ? "Registering" : "Building";
  const className =
    status === "registering"
      ? "border-cc-light-green/35 bg-cc-light-green/10 text-cc-navy"
      : "border-cc-sky-blue/30 bg-cc-light-blue/70 text-cc-navy";

  return (
    <span className={`inline-flex min-h-9 items-center rounded-sm border px-3 py-2 font-heading text-xs font-bold uppercase ${className}`}>
      {label}
    </span>
  );
}

function DataSourcePill({ source }: { source: "live" | "preview" }) {
  const label = source === "live" ? "Live data" : "Preview data";
  const className =
    source === "live"
      ? "border-cc-navy bg-cc-navy text-white"
      : "border-cc-navy/15 bg-white text-cc-navy/70";

  return (
    <span className={`inline-flex min-h-8 items-center rounded-sm border px-3 py-1.5 font-heading text-xs font-bold uppercase ${className}`}>
      {label}
    </span>
  );
}

function EventOperationsCard({ event }: { event: EventOperationsSummary }) {
  return (
    <article className="border border-cc-navy/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-heading text-xs font-bold uppercase leading-none text-cc-sky-blue">
            {event.label}
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold uppercase leading-tight text-cc-dark-blue">
            {event.name}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <DataSourcePill source={event.dataSource} />
          <StatusPill status={event.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {event.metrics.map((metric) => (
          <div key={metric.label} className="border border-cc-navy/10 bg-cc-light-blue/35 p-4">
            <p className="font-heading text-xs font-bold uppercase text-cc-navy/60">
              {metric.label}
            </p>
            <p className="mt-2 font-heading text-2xl font-bold text-cc-dark-blue">
              {metric.value}
            </p>
            {metric.detail ? (
              <p className="mt-2 text-sm leading-5 text-cc-dark-blue/65">
                {metric.detail}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-cc-navy/10 pt-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-heading text-xs font-bold uppercase text-cc-navy/60">
              Readiness
            </p>
            <p className="mt-2 font-heading text-xl font-bold text-cc-dark-blue">
              {event.readinessLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-cc-dark-blue/65">
              {event.readinessDetail}
            </p>
          </div>
          <ListChecks aria-hidden="true" className="hidden text-cc-light-green sm:block" size={28} />
        </div>
      </div>

      <div className="mt-5 grid gap-2">
        {event.followUps.map((item) => (
          <div
            key={item.label}
            className="flex items-start justify-between gap-4 border border-cc-navy/10 p-3 transition hover:border-cc-sky-blue"
          >
            <div>
              <p className="font-heading text-sm font-bold text-cc-dark-blue">
                {item.label}
              </p>
              <p className="mt-1 text-sm leading-5 text-cc-dark-blue/65">{item.detail}</p>
            </div>
            <span className="font-heading text-xl font-bold text-cc-dark-blue">
              {item.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ControlLink href={event.adminHref} icon={<Database aria-hidden="true" size={17} />}>
          Manage
        </ControlLink>
        <ControlLink href={event.href} icon={<ShieldCheck aria-hidden="true" size={17} />}>
          View Page
        </ControlLink>
      </div>
    </article>
  );
}

function FollowUpQueue({ events }: { events: EventOperationsSummary[] }) {
  const items = events.flatMap((event) =>
    event.followUps
      .filter((item) => item.count > 0)
      .map((item) => ({
        ...item,
        eventName: event.name,
        eventHref: event.adminHref,
      })),
  );

  return (
    <section className="border border-cc-navy/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-xs font-bold uppercase leading-none text-cc-sky-blue">
            Follow-up queue
          </p>
          <h2 className="mt-3 font-heading text-2xl font-bold text-cc-dark-blue">
            Work that needs a human hand.
          </h2>
        </div>
        <ClipboardList aria-hidden="true" className="text-cc-sky-blue" size={30} />
      </div>

      <div className="mt-6 grid gap-3">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={`${item.eventName}-${item.label}`}
              href={item.eventHref}
              className="grid gap-3 border border-cc-navy/10 p-4 transition hover:border-cc-sky-blue hover:bg-cc-light-blue/35 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <p className="font-heading text-base font-bold text-cc-dark-blue">
                  {item.label}
                </p>
                <p className="mt-1 text-sm uppercase leading-5 text-cc-dark-blue/65">
                  {item.eventName}
                </p>
              </div>
              <p className="font-heading text-2xl font-bold text-cc-navy">
                {item.count}
              </p>
            </Link>
          ))
        ) : (
          <p className="border border-cc-navy/10 bg-cc-light-blue/30 p-4 text-sm leading-6 text-cc-dark-blue/65">
            No follow-up items are flagged right now.
          </p>
        )}
      </div>
    </section>
  );
}

function ExportHub({ events }: { events: EventOperationsSummary[] }) {
  return (
    <section className="border border-cc-navy/10 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-heading text-xs font-bold uppercase leading-none text-cc-sky-blue">
            Export hub
          </p>
          <h2 className="mt-3 font-heading text-2xl font-bold text-cc-dark-blue">
            Files for reconciliation.
          </h2>
        </div>
        <Download aria-hidden="true" className="text-cc-light-green" size={30} />
      </div>

      <div className="mt-6 grid gap-5">
        {events.map((event) => (
          <div key={event.id}>
            <p className="font-heading text-sm font-bold uppercase text-cc-navy/65">
              {event.name}
            </p>
            <div className="mt-3 grid gap-2">
              {event.exports.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-11 items-center justify-between gap-3 border border-cc-navy/10 px-3 py-2 font-heading text-sm font-semibold text-cc-dark-blue transition hover:border-cc-sky-blue hover:bg-cc-light-blue/35"
                >
                  {item.label}
                  <Download aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ControlLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-between gap-2 rounded-sm border border-cc-navy/15 px-4 py-2 font-heading text-sm font-semibold text-cc-navy transition hover:border-cc-sky-blue hover:bg-cc-light-blue/45"
    >
      {children}
      {icon}
    </Link>
  );
}
