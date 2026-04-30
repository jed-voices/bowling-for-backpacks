import Image from "next/image";
import { Backpack, Heart, PencilRuler } from "lucide-react";
import { bowlingPhotos } from "@/lib/bowling/photos";

const items = [
  {
    amount: "$50",
    label: "helps stock a backpack with basic classroom supplies.",
  },
  {
    amount: "$250",
    label: "helps several students begin the year with supplies and confidence.",
  },
  {
    amount: "$750",
    label: "registers a team and fuels practical relief for families.",
  },
];

export function BowlingSupportProvides() {
  return (
    <section className="bg-bfb-navy py-16 text-white sm:py-20" aria-labelledby="support-provides">
      <div className="bfb-shell grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
        <div>
          <p className="bfb-eyebrow text-white">What your support provides</p>
          <h2 id="support-provides" className="mt-4 font-heading text-3xl font-black leading-tight sm:text-5xl">
            Practical generosity for a strong start.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/75">
            A Christmas in July night can become relief for families, dignity for
            students, and another doorway into relationship.
          </p>
          <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-sm bg-bfb-ink shadow-soft">
            <Image
              src={bowlingPhotos.support.src}
              alt={bowlingPhotos.support.alt}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
          {items.map((item, index) => {
            const Icon = [Backpack, PencilRuler, Heart][index];

            return (
              <article key={item.amount} className="rounded-sm bg-white/10 p-5">
                <Icon aria-hidden="true" className="text-bfb-green" size={28} />
                <p className="mt-5 font-heading text-3xl font-black text-white">
                  {item.amount}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/75">{item.label}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
