import Image from "next/image";
import { Ticket } from "lucide-react";
import { galaCopy } from "@/lib/gala/copy";
import { galaPhotos } from "@/lib/gala/photos";

export function AuctionSection() {
  return (
    <section className="bg-sftc-evening py-20 text-white sm:py-24" aria-labelledby="auction-heading">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.9fr_0.8fr] lg:items-center">
        <div>
          <p className="eyebrow text-sftc-gold">{galaCopy.auction.eyebrow}</p>
          <h2 id="auction-heading" className="mt-4 max-w-2xl font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
            {galaCopy.auction.headline}
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-8 text-white/75">
            {galaCopy.auction.body.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 border-l-2 border-sftc-hope pl-5">
            <Ticket aria-hidden="true" className="text-sftc-hope" size={24} />
            <div className="mt-4 space-y-4 text-base leading-7 text-white/75">
              {galaCopy.auction.chance.split("\n\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="relative h-[480px] w-full rounded-sm shadow-soft">
          <Image
            src={galaPhotos.auctionAtmosphere.src}
            alt={galaPhotos.auctionAtmosphere.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="rounded-sm object-cover"
          />
        </div>
      </div>
    </section>
  );
}
