import { ArrowUpRight, Mic2 } from "lucide-react";
import { eventConfig } from "@/lib/gala/config";
import { galaCopy } from "@/lib/gala/copy";

export function VoicesOfOKCSection() {
  return (
    <section className="bg-white py-20 sm:py-24" aria-labelledby="voices-heading">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.7fr_1fr] lg:items-center">
        <div className="flex min-h-72 items-center justify-center bg-sftc-ivory p-10 text-center">
          <div>
            <Mic2 aria-hidden="true" className="mx-auto text-sftc-brass" size={38} />
            <p className="mt-6 font-display text-4xl leading-tight text-sftc-ink">
              Voices of OKC
            </p>
            <p className="mt-4 text-sm font-semibold uppercase text-sftc-ink/48">
              Stories in their own voice
            </p>
          </div>
        </div>
        <div>
          <p className="eyebrow">{galaCopy.voices.eyebrow}</p>
          <h2 id="voices-heading" className="section-heading mt-4 max-w-3xl">
            {galaCopy.voices.headline}
          </h2>
          <div className="mt-6 space-y-5">
            {galaCopy.voices.body.split("\n\n").map((paragraph) => (
              <p className="body-copy" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <a
            href={eventConfig.voicesOfOkcUrl}
            className="button-quiet mt-8"
            target="_blank"
            rel="noreferrer"
          >
            {galaCopy.voices.cta}
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
