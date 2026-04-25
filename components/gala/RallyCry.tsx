import { galaCopy } from "@/lib/gala/copy";

export function RallyCry() {
  return (
    <section className="bg-sftc-evening px-5 py-20 text-center text-white sm:py-24">
      <p className="mx-auto max-w-4xl whitespace-pre-line font-display text-5xl font-medium leading-[1.05] sm:text-6xl">
        {galaCopy.rallyCry.headline}
      </p>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/75">
        {galaCopy.rallyCry.body}
      </p>
    </section>
  );
}
