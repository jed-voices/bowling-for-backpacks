import Link from "next/link";
import { ArrowRight, CalendarDays, Gift, MapPin } from "lucide-react";
import { BowlingSplashPhotoRotation } from "@/components/bowling/BowlingSplashPhotoRotation";

export default function SplashPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bfb-navy text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(93,203,163,0.22),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(63,159,236,0.28),transparent_34%),linear-gradient(135deg,#11132F_0%,#112F6D_56%,#11132F_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-bfb-green/70" />

      <section className="relative flex min-h-screen items-center px-6 py-14">
        <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.72fr)] lg:items-center">
          <div>
            <p className="inline-flex rounded-sm border border-bfb-green/40 bg-white/10 px-3 py-2 font-heading text-xs font-black uppercase tracking-[0.22em] text-bfb-green">
              City Center Christmas in July
            </p>
            <h1 className="mt-6 max-w-4xl font-heading text-5xl font-black uppercase leading-[0.94] sm:text-7xl lg:text-8xl">
              Bowling for Backpacks
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-semibold leading-8 text-white/90 sm:text-2xl sm:leading-9">
              Bowl a frame. Sponsor a lane. Help students walk into the school year ready.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              This City Center fundraiser turns a summer night of fun into backpacks,
              school supplies, and practical support for students and families across Oklahoma City.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/bowling-for-backpacks#registration" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-sm bg-white px-6 py-4 font-heading text-sm font-black uppercase tracking-wide text-bfb-navy shadow-sm transition hover:bg-bfb-green">
                Register or Sponsor
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <Link href="/bowling-for-backpacks" className="inline-flex min-h-13 items-center justify-center rounded-sm border border-white/30 bg-white/10 px-6 py-4 font-heading text-sm font-black uppercase tracking-wide text-white transition hover:border-bfb-green hover:bg-white/20">
                View Event Details
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <BowlingSplashPhotoRotation />

            <aside className="rounded-sm border border-white/15 bg-white/10 p-6 shadow-soft backdrop-blur">
              <p className="font-heading text-sm font-black uppercase tracking-[0.18em] text-bfb-green">Event snapshot</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
                <div className="flex gap-3"><CalendarDays aria-hidden="true" className="mt-1 text-bfb-green" size={22} /><div><p className="font-heading text-lg font-black">July 16, 2026</p><p className="text-sm leading-6 text-white/65">Two bowling sessions plus community connection.</p></div></div>
                <div className="flex gap-3"><MapPin aria-hidden="true" className="mt-1 text-bfb-blue" size={22} /><div><p className="font-heading text-lg font-black">Andy B&apos;s</p><p className="text-sm leading-6 text-white/65">Oklahoma City</p></div></div>
                <div className="flex gap-3"><Gift aria-hidden="true" className="mt-1 text-bfb-green" size={22} /><div><p className="font-heading text-lg font-black">Teams, lanes, sponsors, gifts</p><p className="text-sm leading-6 text-white/65">Choose the way you want to help students start strong.</p></div></div>
              </div>
              <div className="mt-6 rounded-sm border border-bfb-green/30 bg-bfb-green/10 p-4">
                <p className="text-sm font-bold leading-6 text-white/85">Spots are limited. Reserving early helps City Center plan well and serve families with dignity.</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
