import { galaCopy } from "@/lib/gala/copy";

export function ScheduleSection() {
  return (
    <section className="bg-white py-20 sm:py-24" aria-labelledby="schedule-heading">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Schedule</p>
          <h2 id="schedule-heading" className="section-heading mt-4">
            {galaCopy.schedule.headline}
          </h2>
        </div>

        <div className="mt-12 divide-y divide-sftc-ink/12 border-y border-sftc-ink/12">
          {galaCopy.schedule.items.map((item) => (
            <article key={item.time} className="grid gap-4 py-7 md:grid-cols-[160px_1fr]">
              <p className="font-heading text-lg font-semibold text-sftc-brass">{item.time}</p>
              <div>
                <h3 className="font-heading text-xl font-semibold text-sftc-ink">{item.title}</h3>
                <p className="mt-2 max-w-3xl text-base leading-7 text-sftc-ink/70">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm leading-6 text-sftc-ink/60">{galaCopy.schedule.note}</p>
      </div>
    </section>
  );
}
