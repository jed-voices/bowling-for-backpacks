"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

type BowlingAdminActionButtonProps = {
  registrationId: string;
  action: "mark-paid" | "mark-exported";
  label: string;
  disabled?: boolean;
};

export function BowlingAdminActionButton({
  registrationId,
  action,
  label,
  disabled = false,
}: BowlingAdminActionButtonProps) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const handleClick = async () => {
    setState("saving");

    try {
      let response = await fetch("/api/bowling/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, registrationId }),
      });

      if (response.status === 401) {
        const secret = window.prompt("Enter the admin secret to update this registration.");

        if (!secret) {
          setState("idle");
          return;
        }

        response = await fetch("/api/bowling/admin/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, registrationId, secret }),
        });
      }

      if (!response.ok) {
        throw new Error("Update failed");
      }

      setState("saved");
      window.location.reload();
    } catch {
      setState("error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || state === "saving" || state === "saved"}
      className="inline-flex items-center gap-2 rounded-sm border border-cc-light-green/40 bg-cc-light-green/15 px-3 py-2 font-heading text-xs font-bold uppercase text-cc-navy transition hover:bg-cc-light-green/25 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <CheckCircle2 aria-hidden="true" size={14} />
      {state === "saving" ? "Saving..." : state === "saved" ? "Saved" : state === "error" ? "Try again" : label}
    </button>
  );
}
