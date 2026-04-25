"use client";

import { Mail, Utensils, UserRound } from "lucide-react";
import { mealChoices } from "@/lib/gala/config";
import type { GalaGuest } from "@/lib/gala/types";

type GuestListBuilderProps = {
  seats: number;
  guests: GalaGuest[];
  onChange: (guests: GalaGuest[]) => void;
};

export function GuestListBuilder({ seats, guests, onChange }: GuestListBuilderProps) {
  const updateGuest = (index: number, key: keyof GalaGuest, value: string | number) => {
    const nextGuests = guests.map((guest, guestIndex) =>
      guestIndex === index ? { ...guest, [key]: value } : guest,
    );
    onChange(nextGuests);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold text-sftc-ink">Guest list</h3>
          <p className="field-help">
            {seats} {seats === 1 ? "seat is" : "seats are"} included. Names can be saved now
            or completed later through the guest-list link.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {guests.map((guest, index) => (
          <details
            key={index}
            className="rounded-sm border border-sftc-ink/12 bg-white"
            open={index < Math.min(2, seats)}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4">
              <span className="flex items-center gap-3 font-heading font-semibold text-sftc-ink">
                <UserRound aria-hidden="true" className="text-sftc-brass" size={18} />
                Guest {index + 1}
              </span>
              <span className="truncate text-sm text-sftc-ink/60">
                {[guest.firstName, guest.lastName].filter(Boolean).join(" ") || "Name pending"}
              </span>
            </summary>

            <div className="grid gap-4 border-t border-sftc-ink/10 p-4 md:grid-cols-2">
              <label>
                <span className="field-label">First name</span>
                <input
                  className="field-input"
                  value={guest.firstName}
                  onChange={(event) => updateGuest(index, "firstName", event.target.value)}
                  autoComplete="given-name"
                />
              </label>
              <label>
                <span className="field-label">Last name</span>
                <input
                  className="field-input"
                  value={guest.lastName}
                  onChange={(event) => updateGuest(index, "lastName", event.target.value)}
                  autoComplete="family-name"
                />
              </label>
              <label>
                <span className="field-label">Email</span>
                <div className="relative">
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sftc-ink/35"
                    size={17}
                  />
                  <input
                    className="field-input pl-10"
                    type="email"
                    value={guest.email}
                    onChange={(event) => updateGuest(index, "email", event.target.value)}
                    autoComplete="email"
                  />
                </div>
              </label>
              <label>
                <span className="field-label">Phone</span>
                <input
                  className="field-input"
                  value={guest.phone}
                  onChange={(event) => updateGuest(index, "phone", event.target.value)}
                  autoComplete="tel"
                />
              </label>
              <label>
                <span className="field-label">Meal choice</span>
                <div className="relative">
                  <Utensils
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sftc-ink/35"
                    size={17}
                  />
                  <select
                    className="field-input pl-10"
                    value={guest.mealChoice}
                    onChange={(event) => updateGuest(index, "mealChoice", event.target.value)}
                  >
                    {mealChoices.map((choice) => (
                      <option key={choice} value={choice}>
                        {choice}
                      </option>
                    ))}
                  </select>
                </div>
              </label>
              <label>
                <span className="field-label">Dietary notes</span>
                <input
                  className="field-input"
                  value={guest.dietaryNotes}
                  onChange={(event) => updateGuest(index, "dietaryNotes", event.target.value)}
                  placeholder="Allergies or access needs"
                />
              </label>
              <label className="md:col-span-2">
                <span className="field-label">Guest table request</span>
                <input
                  className="field-input"
                  value={guest.tableRequest}
                  onChange={(event) => updateGuest(index, "tableRequest", event.target.value)}
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
