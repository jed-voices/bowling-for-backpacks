import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { bowlingCopy } from "@/lib/bowling/copy";
import { bowlingPhotos } from "@/lib/bowling/photos";

export function BowlingExperience() {
  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="bowling-experience">
      <div className="bfb-shell grid gap-10 lg:grid-cols-[0.7fr_1fr] lg:items-center">
        <div className="relative min-h-[380px] overflow-hidden rounded-sm bg-bfb-light shadow-soft sm:min-h-[420px]">
          <Image
            src={bowlingPhotos.experience.src}
            alt={bowlingPhotos.experience.alt}
            fill
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,47,0.08),rgba(17,47,109,0.44))]" />
          <div className="absolute inset-x-4 bottom-4 rounded-sm border-l-4 border-bfb-green bg-bfb-cream p-5 shadow-soft sm:inset-x-5 sm:bottom-5 sm:p-6">
            <p className="font-heading text-sm font-black uppercase text-bfb-navy">
              Christmas in July night
            </p>
            <p className="mt-3 max-w-md font-heading text-3xl font-black leading-tight text-bfb-navy sm:text-4xl lg:text-5xl">
              Fun, fast, full of purpose.
            </p>
          </div>
        </div>
        <div>
          <p className="bfb-eyebrow">Event experience</p>
          <h2 id="bowling-experience" className="bfb-heading mt-4">
            {bowlingCopy.experience.headline}
          </h2>
          <p className="bfb-copy mt-5">{bowlingCopy.experience.body}</p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {bowlingCopy.experience.items.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-6 text-bfb-ink/75">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-bfb-green" size={19} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
