import { ArrowRight, CalendarClock, CreditCard, Mail } from "lucide-react";
import { eventConfig } from "@/lib/gala/config";

// Registration for 2026 lives on Greater Giving. The on-site RegistrationForm
// component is kept in the codebase but is not rendered: its API route does not
// persist registrations and its card checkout is a placeholder.
export function RegisterSection() {
  return (
    <section id="registration" className="bg-white py-20 sm:py-24" aria-labelledby="register-heading">
      <div className="section-shell grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
        <div>
          <p className="eyebrow">Register</p>
          <h2 id="register-heading" className="section-heading mt-4">
            Reserve your seat or table.
          </h2>
          <p className="body-copy mt-5 max-w-2xl">
            Tickets, tables, and gifts are handled on Greater Giving, City Center&apos;s
            event registration partner. You can pay by card there. Guest names can be
            sent now or closer to the event.
          </p>
          <a href={eventConfig.registrationUrl} className="button-primary mt-8">
            Register on Greater Giving
            <ArrowRight aria-hidden="true" size={17} />
          </a>
        </div>

        <dl className="grid gap-px overflow-hidden rounded-sm border border-sftc-ink/10 bg-sftc-ink/10">
          <div className="flex gap-4 bg-sftc-ivory p-5">
            <CalendarClock aria-hidden="true" className="mt-0.5 shrink-0 text-sftc-brass" size={20} />
            <div>
              <dt className="font-heading text-xs font-semibold uppercase text-sftc-ink/55">Registration closes</dt>
              <dd className="mt-1 font-semibold text-sftc-ink">{eventConfig.registrationCloses}</dd>
            </div>
          </div>
          <div className="flex gap-4 bg-sftc-ivory p-5">
            <CreditCard aria-hidden="true" className="mt-0.5 shrink-0 text-sftc-brass" size={20} />
            <div>
              <dt className="font-heading text-xs font-semibold uppercase text-sftc-ink/55">Prefer to pay by check?</dt>
              <dd className="mt-1 text-sftc-ink/75">Mail to {eventConfig.checkMailingAddress}</dd>
            </div>
          </div>
          <div className="flex gap-4 bg-sftc-ivory p-5">
            <Mail aria-hidden="true" className="mt-0.5 shrink-0 text-sftc-brass" size={20} />
            <div>
              <dt className="font-heading text-xs font-semibold uppercase text-sftc-ink/55">Questions</dt>
              <dd className="mt-1 text-sftc-ink/75">
                <a className="underline underline-offset-4 hover:text-sftc-ink" href={`mailto:${eventConfig.contactEmail}`}>
                  {eventConfig.contactEmail}
                </a>{" "}
                / <span className="whitespace-nowrap">{eventConfig.contactPhone}</span>
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </section>
  );
}
