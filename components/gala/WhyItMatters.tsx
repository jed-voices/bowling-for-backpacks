import { galaCopy } from "@/lib/gala/copy";

export function WhyItMatters() {
  return (
    <section className="bg-white py-20 sm:py-24" aria-labelledby="why-this-night-matters">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_0.7fr] lg:items-start">
        <div>
          <p className="eyebrow">{galaCopy.whyItMatters.eyebrow}</p>
          <h2 id="why-this-night-matters" className="section-heading mt-4 max-w-2xl">
            {galaCopy.whyItMatters.headline}
          </h2>
        </div>
        <div className="space-y-5">
          {galaCopy.whyItMatters.paragraphs.map((paragraph) => (
            <p className="body-copy" key={paragraph}>
              {paragraph}
            </p>
          ))}
          <blockquote className="border-l-2 border-sftc-hope bg-sftc-ivory px-5 py-5 font-display text-2xl leading-tight text-sftc-ink sm:text-3xl">
            {galaCopy.whyItMatters.quote}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
