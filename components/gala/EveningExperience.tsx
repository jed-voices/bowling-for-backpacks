import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { galaCopy } from "@/lib/gala/copy";
import { galaPhotos } from "@/lib/gala/photos";

export function EveningExperience() {
  return (
    <section className="bg-sftc-ivory py-20 sm:py-24" aria-labelledby="evening-heading">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_0.85fr] lg:items-center">
        <div>
          <p className="eyebrow">{galaCopy.evening.eyebrow}</p>
          <h2 id="evening-heading" className="section-heading mt-4 max-w-2xl">
            {galaCopy.evening.headline}
          </h2>
          <div className="mt-6 space-y-5">
            {galaCopy.evening.paragraphs.map((paragraph) => (
              <p className="body-copy" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {galaCopy.evening.list.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-6 text-sftc-ink/75">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-sftc-hope" size={19} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-[520px]">
          <div className="absolute left-0 top-0 h-[360px] w-[74%] rounded-sm shadow-soft">
            <Image
              src={galaPhotos.eveningPrimary.src}
              alt={galaPhotos.eveningPrimary.alt}
              fill
              sizes="(min-width: 1024px) 38vw, 74vw"
              className="rounded-sm object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-[300px] w-[62%] rounded-sm shadow-soft ring-8 ring-sftc-ivory">
            <Image
              src={galaPhotos.eveningSecondary.src}
              alt={galaPhotos.eveningSecondary.alt}
              fill
              sizes="(min-width: 1024px) 32vw, 62vw"
              className="rounded-sm object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
