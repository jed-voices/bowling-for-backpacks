"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { BowlerListBuilder } from "./BowlerListBuilder";
import type { Bowler } from "@/lib/bowling/types";
import { buildBowlerList } from "@/lib/bowling/validation";

type BowlingTeamManagerProps = {
  accessToken: string;
  initialTeamName: string;
  initialBowlers: Bowler[];
  canSave: boolean;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function BowlingTeamManager({
  accessToken,
  initialTeamName,
  initialBowlers,
  canSave,
}: BowlingTeamManagerProps) {
  const [teamName, setTeamName] = useState(initialTeamName);
  const [bowlers, setBowlers] = useState(buildBowlerList(initialBowlers));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [message, setMessage] = useState(
    canSave
      ? ""
      : "Public team updates are only available for team registrations. If you need help updating details, contact City Center.",
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSave) {
      setSaveState("error");
      setMessage("Team updates are not available for this registration. City Center can help with any changes.");
      return;
    }

    setSaveState("saving");
    setMessage("");

    const response = await fetch(`/api/bowling/team/${accessToken}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teamName, bowlers }),
    });
    const payload = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setSaveState("error");
      setMessage(payload.error ?? "Team details could not be saved.");
      return;
    }

    setSaveState("saved");
    setMessage("Team details saved.");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 rounded-sm border border-bfb-ink/10 bg-bfb-cream p-5 sm:p-6">
      <label>
        <span className="field-label">Team name</span>
        <input
          className="bfb-field"
          value={teamName}
          onChange={(event) => {
            setTeamName(event.target.value);
            setSaveState("idle");
          }}
          placeholder="Optional, but encouraged"
        />
      </label>

      <div className="mt-7">
        <BowlerListBuilder
          bowlers={bowlers}
          onChange={(nextBowlers) => {
            setBowlers(nextBowlers);
            setSaveState("idle");
          }}
        />
      </div>

      {message ? (
        <p
          className={`mt-5 rounded-sm p-3 text-sm font-bold ${
            saveState === "error"
              ? "bg-red-50 text-red-800"
              : "bg-bfb-green/15 text-bfb-ink"
          }`}
          role={saveState === "error" ? "alert" : "status"}
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        className="bfb-primary mt-6 w-full sm:w-auto"
        disabled={saveState === "saving"}
      >
        {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save Team Details"}
        {saveState === "saved" ? (
          <CheckCircle2 aria-hidden="true" size={17} />
        ) : (
          <Save aria-hidden="true" size={17} />
        )}
      </button>
    </form>
  );
}
