"use client";

import { Mail, UserRound } from "lucide-react";
import type { Bowler } from "@/lib/bowling/types";

type BowlerListBuilderProps = {
  bowlers: Bowler[];
  onChange: (bowlers: Bowler[]) => void;
};

export function BowlerListBuilder({ bowlers, onChange }: BowlerListBuilderProps) {
  const updateBowler = (index: number, key: keyof Bowler, value: string) => {
    onChange(
      bowlers.map((bowler, bowlerIndex) =>
        bowlerIndex === index ? { ...bowler, [key]: value } : bowler,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-heading text-xl font-black text-bfb-ink">Bowler names</h3>
        <p className="mt-2 text-sm leading-6 text-bfb-ink/60">
          Add names now if you have them. Team captains can finish this later through
          the team link.
        </p>
      </div>

      <div className="grid gap-3">
        {bowlers.map((bowler, index) => (
          <details
            key={index}
            className="rounded-sm border border-bfb-ink/10 bg-white"
            open={index < 2}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
              <span className="flex items-center gap-3 font-heading font-black text-bfb-ink">
                <UserRound aria-hidden="true" className="text-bfb-blue" size={18} />
                Bowler {index + 1}
              </span>
              <span className="truncate text-sm text-bfb-ink/60">
                {[bowler.firstName, bowler.lastName].filter(Boolean).join(" ") || "Name pending"}
              </span>
            </summary>

            <div className="grid gap-4 border-t border-bfb-ink/10 p-4 md:grid-cols-2">
              <label>
                <span className="field-label">First name</span>
                <input
                  className="bfb-field"
                  aria-label={`Bowler ${index + 1} first name`}
                  value={bowler.firstName}
                  onChange={(event) => updateBowler(index, "firstName", event.target.value)}
                  autoComplete="given-name"
                />
              </label>
              <label>
                <span className="field-label">Last name</span>
                <input
                  className="bfb-field"
                  aria-label={`Bowler ${index + 1} last name`}
                  value={bowler.lastName}
                  onChange={(event) => updateBowler(index, "lastName", event.target.value)}
                  autoComplete="family-name"
                />
              </label>
              <label>
                <span className="field-label">Email</span>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bfb-ink/35"
                    size={17}
                  />
                  <input
                    className="bfb-field pl-10"
                    aria-label={`Bowler ${index + 1} email`}
                    type="email"
                    value={bowler.email}
                    onChange={(event) => updateBowler(index, "email", event.target.value)}
                    autoComplete="email"
                  />
                </div>
              </label>
              <label>
                <span className="field-label">Phone</span>
                <input
                  className="bfb-field"
                  aria-label={`Bowler ${index + 1} phone`}
                  value={bowler.phone}
                  onChange={(event) => updateBowler(index, "phone", event.target.value)}
                  autoComplete="tel"
                />
              </label>
              <label className="md:col-span-2">
                <span className="field-label">Notes</span>
                <input
                  className="bfb-field"
                  aria-label={`Bowler ${index + 1} notes`}
                  value={bowler.notes}
                  onChange={(event) => updateBowler(index, "notes", event.target.value)}
                  placeholder="Optional"
                />
              </label>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
