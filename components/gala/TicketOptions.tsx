import { ArrowRight } from "lucide-react";
import { ticketOptions } from "@/lib/gala/config";
import { formatCurrency } from "@/lib/gala/validation";

export function TicketOptions() {
  return (
    <section className="bg-white py-20 sm:py-24" aria-labelledby="tickets-heading">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Tickets</p>
          <h2 id="tickets-heading" className="section-heading mt-4">
            Reserve seats for the evening.
          </h2>
          <p className="body-copy mt-5">
            Individual tickets and small group options are available for guests who want to
            be part of the evening without hosting a full table.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {ticketOptions.map((ticket) => (
            <article key={ticket.id} className="rounded-sm border border-sftc-ink/10 bg-sftc-ivory p-6">
              <h3 className="font-heading text-xl font-semibold text-sftc-ink">{ticket.name}</h3>
              <p className="mt-4 text-3xl font-semibold text-sftc-ink">
                {formatCurrency(ticket.price)}
              </p>
              <p className="mt-1 text-sm font-semibold text-sftc-ink/60">
                {ticket.seats} {ticket.seats === 1 ? "seat" : "seats"}
              </p>
              <p className="mt-5 min-h-28 text-base leading-7 text-sftc-ink/70">
                {ticket.description}
              </p>
              <a href="#registration" className="button-quiet mt-6">
                Choose Tickets
                <ArrowRight aria-hidden="true" size={16} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
