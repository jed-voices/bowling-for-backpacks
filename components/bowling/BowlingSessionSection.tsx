import { Clock, UsersRound } from "lucide-react";
import { bowlingSessions, bowlingTimeline } from "@/lib/bowling/config";
import type { BowlingRegistrationRecord } from "@/lib/bowling/types";
import {
  remainingLanes,
  remainingLanesFromRegistrations,
} from "@/lib/bowling/validation";

type BowlingSessionSectionProps = {
  registrations?: BowlingRegistrationRecord[];
};

export function BowlingSessionSection({ registrations }: BowlingSessionSectionProps) {
  return (
    <section className="bg-bfb-cream py-16 sm:py-20" aria-labelledby="bowling-sessions">
      <div className="bfb-shell">
        <div className="max-w-3xl">
          <p className="bfb-eyebrow">Sessions</p>
          <h2 id="bowling-sessions" className="bfb-heading mt-4">
            Choose the session that fits your group.
          </h2>
          <p className="bfb-copy mt-5">
            Two bowling sessions bookend a dedicated business networking hour. Each
            bowling session has 21 lanes.
          </p>
        </div>

        <div className="mt-10 grid gap-3 lg:grid-cols-3">
          {bowlingTimeline.map((item) => (
            <article key={item.title} className="rounded-sm bg-white p-5 shadow-sm">
              <p className="font-heading text-sm font-black uppercase text-bfb-navy">
                {item.time}
              </p>
              <h3 className="mt-3 font-heading text-xl font-black text-bfb-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-bfb-ink/70">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {bowlingSessions.map((session) => {
            const remaining = registrations
              ? remainingLanesFromRegistrations(session.id, registrations)
              : remainingLanes(session.id);
            const filled = session.laneCapacity - remaining;
            const percent = Math.round((filled / session.laneCapacity) * 100);

            return (
              <article key={session.id} className="rounded-sm bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-heading text-2xl font-black text-bfb-ink">
                      {session.name}
                    </h3>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-bfb-ink/60">
                      <Clock aria-hidden="true" size={16} />
                      {session.time}
                    </p>
                  </div>
                  <span
                    className={`rounded-sm px-3 py-2 text-sm font-black ${
                      remaining > 0
                        ? "bg-bfb-green/20 text-bfb-ink"
                        : "bg-bfb-light text-bfb-ink"
                    }`}
                  >
                    {remaining > 0
                      ? `${remaining} lanes remaining`
                      : "This session is currently full"}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-6 text-bfb-ink/70">
                  {session.description}
                </p>
                <div className="mt-6">
                  <div className="flex justify-between text-sm font-bold text-bfb-ink/60">
                    <span>21 lanes available</span>
                    <span>{filled}/{session.laneCapacity} lanes held</span>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-bfb-light">
                    <span
                      className="block h-full rounded-full bg-bfb-blue"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <p className="mt-5 flex gap-2 text-sm leading-6 text-bfb-ink/70">
                  <UsersRound aria-hidden="true" className="mt-1 shrink-0 text-bfb-blue" size={16} />
                  {remaining > 0
                    ? "Register a team now and add bowler names later."
                    : "Join the waitlist or choose another session."}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
