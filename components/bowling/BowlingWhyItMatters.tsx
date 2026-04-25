import { bowlingCopy } from "@/lib/bowling/copy";

export function BowlingWhyItMatters() {
  return (
    <section className="bg-bfb-cream py-16 sm:py-20" aria-labelledby="bowling-why">
      <div className="bfb-shell grid gap-10 lg:grid-cols-[0.75fr_1fr] lg:items-start">
        <div>
          <p className="bfb-eyebrow">{bowlingCopy.why.eyebrow}</p>
          <h2 id="bowling-why" className="bfb-heading mt-4">
            {bowlingCopy.why.headline}
          </h2>
        </div>
        <div className="space-y-5">
          {bowlingCopy.why.paragraphs.map((paragraph) => (
            <p key={paragraph} className="bfb-copy">
              {paragraph}
            </p>
          ))}
          <blockquote className="rounded-sm border-l-4 border-bfb-green bg-white p-5 font-heading text-2xl font-black leading-tight text-bfb-navy">
            {bowlingCopy.why.quote}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
