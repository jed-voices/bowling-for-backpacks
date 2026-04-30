import { Backpack, CalendarDays, Clock, Gift, MapPin } from "lucide-react";
import { bowlingEventConfig } from "@/lib/bowling/config";

const details = [
  {
    icon: CalendarDays,
    label: "Date",
    value: bowlingEventConfig.date,
  },
  {
    icon: MapPin,
    label: "Location",
    value: `${bowlingEventConfig.venue} / ${bowlingEventConfig.city}`,
  },
  {
    icon: Gift,
    label: "Theme",
    value: bowlingEventConfig.theme,
  },
  {
    icon: Clock,
    label: "Sessions",
    value: "2:00 PM corporate / 4:15 PM networking / 5:30 PM community & family",
  },
  {
    icon: Backpack,
    label: "Supports",
    value: bowlingEventConfig.cause,
  },
];

export function BowlingEventDetails() {
  return (
    <section className="bg-white py-10" aria-labelledby="bowling-details">
      <div className="bfb-shell">
        <h2 id="bowling-details" className="sr-only">
          Event details
        </h2>
        <div className="grid gap-px overflow-hidden rounded-sm border border-bfb-ink/10 bg-bfb-ink/10 shadow-sm md:grid-cols-5">
          {details.map((detail) => {
            const Icon = detail.icon;

            return (
              <article key={detail.label} className="bg-bfb-cream p-5 transition hover:bg-white">
                <Icon aria-hidden="true" className="text-bfb-blue" size={23} />
                <p className="mt-5 font-heading text-xs font-bold uppercase text-bfb-ink/50">
                  {detail.label}
                </p>
                <p className="mt-2 break-words text-base font-bold leading-6 text-bfb-ink">
                  {detail.value}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
