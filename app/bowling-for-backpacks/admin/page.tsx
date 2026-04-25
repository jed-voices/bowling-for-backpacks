import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ClipboardList, CreditCard, Download, ExternalLink, Mail, UsersRound } from "lucide-react";
import { bowlingEventConfig } from "@/lib/bowling/config";
import { isBowlingDatabaseConfigured, listBowlingRegistrations } from "@/lib/bowling/database";
import type { BowlingRegistrationRecord } from "@/lib/bowling/types";
import { BowlingAdminActionButton } from "@/components/bowling/BowlingAdminActionButton";

export const metadata: Metadata = {
  title: "Bowling Admin Dashboard",
};

// (rest unchanged until ActionButtons)

function ActionButtons({ registration }: { registration: BowlingRegistrationRecord }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <a href={mailtoForRegistration(registration)} className="inline-flex items-center gap-2 rounded-sm bg-bfb-navy px-3 py-2 font-heading text-xs font-bold uppercase text-white transition hover:bg-bfb-blue">
        <Mail aria-hidden="true" size={14} /> Email
      </a>

      {registration.laneCount > 0 ? (
        <Link href={teamLink(registration)} className="inline-flex items-center gap-2 rounded-sm border border-bfb-ink/10 bg-white px-3 py-2 font-heading text-xs font-bold uppercase text-bfb-navy transition hover:border-bfb-blue">
          <ExternalLink aria-hidden="true" size={14} /> Team link
        </Link>
      ) : null}

      {registration.paymentStatus !== "paid" ? (
        <BowlingAdminActionButton
          registrationId={registration.id}
          action="mark-paid"
          label="Mark paid"
        />
      ) : null}

      {registration.exportStatus !== "exported" ? (
        <BowlingAdminActionButton
          registrationId={registration.id}
          action="mark-exported"
          label="Mark exported"
        />
      ) : null}
    </div>
  );
}

// rest unchanged
