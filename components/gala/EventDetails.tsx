import { CalendarDays, MapPin, Shirt, Utensils } from "lucide-react";
import { eventConfig } from "@/lib/gala/config";
import { galaCopy } from "@/lib/gala/copy";

const details = [
  {
    icon: CalendarDays,
    label: "Date",
    value: eventConfig.season,
  },
  {
    icon: MapPin,
    label: "Location",
    value: `${eventConfig.venue} / ${eventConfig.city}`,
  },
  {
    icon: Utensils,
    label: "Evening",
    value: eventConfig.auctionLine,
  },
  {
    icon: Shirt,
    label: "Attire",
    value: eventConfig.attire,
  },
];

export function EventDetails() {
  return (
    <section className="bg-sftc-ivory py-12" aria-labelledby="event-details">
      <div className="section-shell">
        <h2 id="event-details" className="sr-only">
          Event details
        </h2>
        <div className="grid gap-px overflow-hidden rounded-sm bg-sftc-ink/12 md:grid-cols-4">
          {details.map((detail) => {
            const Icon = detail.icon;

            return (
              <div key={detail.label} className="bg-white/80 p-6">
                <Icon aria-hidden="true" className="text-sftc-brass" size={22} />
                <p className="mt-5 font-heading text-xs font-semibold uppercase text-sftc-ink/52">
                  {detail.label}
                </p>
                <p className="mt-2 text-base font-semibold leading-6 text-sftc-ink">
                  {detail.value}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm leading-6 text-sftc-ink/60">
          {galaCopy.eventDetails}
        </p>
      </div>
    </section>
  );
}
