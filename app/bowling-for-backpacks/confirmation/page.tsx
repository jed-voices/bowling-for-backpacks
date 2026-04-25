import type { Metadata } from "next";
import Link from "next/link";
import { Backpack, CheckCircle2, ClipboardList, CreditCard } from "lucide-react";
import { bowlingEventConfig, paymentPreferenceLabels } from "@/lib/bowling/config";
import type { BowlingPaymentPreference } from "@/lib/bowling/types";

export const metadata: Metadata = {
  title: "Bowling Registration Received",
};

type ConfirmationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BowlingConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = (await searchParams) ?? {};
  const registrationId =
    typeof params.registrationId === "string" ? params.registrationId : "BFB-PENDING";
  const paymentParam = typeof params.payment === "string" ? params.payment : "card";
  const paymentPreference: BowlingPaymentPreference = ["card", "invoice", "check"].includes(paymentParam)
    ? (paymentParam as BowlingPaymentPreference)
    : "card";
  const paymentCopy: Record<BowlingPaymentPreference, string> = {
    card: `Your registration has been saved. ${bowlingEventConfig.contactName}, City Center's ${bowlingEventConfig.contactTitle}, can follow up with a secure card payment link and any final event details.`,
    invoice: `Your invoice request has been saved. ${bowlingEventConfig.contactName}, City Center's ${bowlingEventConfig.contactTitle}, can follow up with invoice details and next steps.`,
    check: `Your check pledge has been saved. ${bowlingEventConfig.contactName}, City Center's ${bowlingEventConfig.contactTitle}, can follow up with mailing or drop-off instructions.`,
  };

  return (
    <main className="min-h-screen bg-bfb-cream py-16">
      <div className="bfb-shell max-w-4xl">
        <Link href="/bowling-for-backpacks" className="bfb-secondary">
          Back to Bowling for Backpacks
        </Link>

        <section className="mt-8 rounded-sm border border-bfb-ink/10 bg-white p-8 shadow-soft sm:p-10">
          <CheckCircle2 aria-hidden="true" className="text-bfb-green" size={42} />
          <p className="bfb-eyebrow mt-8">Registration received</p>
          <h1 className="mt-4 font-heading text-4xl font-black leading-tight text-bfb-ink sm:text-5xl">
            Thanks for helping students start the year ready.
          </h1>
          <p className="bfb-copy mt-6">{paymentCopy[paymentPreference]}</p>
          <p className="mt-4 text-base leading-7 text-bfb-ink/70">
            Questions? Email{" "}
            <a
              href={`mailto:${bowlingEventConfig.contactEmail}`}
              className="font-bold text-bfb-navy underline underline-offset-4"
            >
              {bowlingEventConfig.contactEmail}
            </a>
            .
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-sm bg-bfb-light p-5">
              <Backpack aria-hidden="true" className="text-bfb-blue" size={24} />
              <p className="mt-4 text-sm font-bold uppercase text-bfb-ink/50">
                Confirmation code
              </p>
              <p className="mt-2 break-all font-heading text-lg font-black text-bfb-ink">
                {registrationId}
              </p>
            </div>
            <div className="rounded-sm bg-bfb-light p-5">
              <CreditCard aria-hidden="true" className="text-bfb-blue" size={24} />
              <p className="mt-4 text-sm font-bold uppercase text-bfb-ink/50">
                Payment preference
              </p>
              <p className="mt-2 font-heading text-lg font-black text-bfb-ink">
                {paymentPreferenceLabels[paymentPreference]}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-sm border border-bfb-green/35 bg-bfb-green/10 p-5">
            <ClipboardList aria-hidden="true" className="text-bfb-ink" size={23} />
            <h2 className="mt-4 font-heading text-xl font-black text-bfb-ink">
              Team link
            </h2>
            <p className="mt-2 text-base leading-7 text-bfb-ink/70">
              Team captains can complete bowler names later at{" "}
              <Link
                href={`${bowlingEventConfig.teamBaseUrl}/${registrationId}`}
                className="break-all font-bold text-bfb-navy underline underline-offset-4"
              >
                {bowlingEventConfig.teamBaseUrl}/{registrationId}
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
