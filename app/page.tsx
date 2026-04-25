import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SplashPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-bfb-navy text-white px-6">
      <div className="max-w-2xl text-center">
        <p className="uppercase text-sm tracking-widest text-bfb-green">City Center</p>
        <h1 className="mt-4 text-4xl sm:text-6xl font-black leading-tight">
          Bowling for Backpacks
        </h1>
        <p className="mt-6 text-lg text-white/80">
          A simple way to help students start the school year ready — with backpacks,
          supplies, and support.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/bowling-for-backpacks#registration"
            className="inline-flex items-center justify-center gap-2 bg-white text-bfb-navy px-6 py-3 font-bold uppercase text-sm"
          >
            Register or Sponsor
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/bowling-for-backpacks"
            className="inline-flex items-center justify-center gap-2 border border-white/40 px-6 py-3 font-bold uppercase text-sm"
          >
            Learn More
          </Link>
        </div>
      </div>
    </main>
  );
}
