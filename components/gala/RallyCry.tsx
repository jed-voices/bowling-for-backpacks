import Image from "next/image";
import { galaCopy } from "@/lib/gala/copy";
import { galaPhotos } from "@/lib/gala/photos";

export function RallyCry() {
  return (
    <section className="relative isolate overflow-hidden bg-sftc-evening px-5 py-24 text-center text-white sm:py-28">
      <Image
        src={galaPhotos.rallyCry.src}
        alt={galaPhotos.rallyCry.alt}
        fill
        sizes="100vw"
        className="-z-10 object-cover"
        style={{ objectPosition: galaPhotos.rallyCry.position }}
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgb(var(--sftc-evening) / 0.92) 0%, rgb(var(--sftc-evening) / 0.86) 100%)",
        }}
      />
      <p className="mx-auto max-w-4xl whitespace-pre-line font-display text-5xl font-medium leading-[1.05] sm:text-6xl">
        {galaCopy.rallyCry.headline}
      </p>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
        {galaCopy.rallyCry.body}
      </p>
    </section>
  );
}
