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
    const secret = window.prompt("Enter the admin secret to update this registration.");

    if (!secret) {
      return;
    }

    setState("saving");

    try {
      const response = await fetch("/api/bowling/admin/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, registrationId, secret }),
      });

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
      className="inline-flex items-center gap-2 rounded-sm border border-bfb-green/40 bg-bfb-green/15 px-3 py-2 font-heading text-xs font-bold uppercase text-bfb-navy transition hover:bg-bfb-green/25 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <CheckCircle2 aria-hidden="true" size={14} />
      {state === "saving" ? "Saving..." : state === "saved" ? "Saved" : state === "error" ? "Try again" : label}
    </button>
  );
}
