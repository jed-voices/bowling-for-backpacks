import type { Metadata } from "next";
import Link from "next/link";
import { Backpack, CheckCircle2, ClipboardList, CreditCard, Mail } from "lucide-react";
import { EventGatewayBackLink } from "@/components/events/EventGatewayBackLink";
import { bowlingEventConfig, paymentPreferenceLabels } from "@/lib/bowling/config";
import { getBowlingRegistration } from "@/lib/bowling/database";
import type { BowlingPaymentPreference, BowlingRegistrationType } from "@/lib/bowling/types";
import { needsSession } from "@/lib/bowling/validation";

export const metadata: Metadata = {
  title: "Bowling Registration Received",
};

type ConfirmationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const registrationTypes: BowlingRegistrationType[] = ["team", "sponsorship", "lane-sponsor", "gift"];

const getStringParam = (
  params: Record<string, string | string[] | undefined>,
  key: string,
  fallback = "",
) => {
  const value = params[key];

  return typeof value === "string" ? value : fallback;
};

const getRegistrationTypeParam = (value: string): BowlingRegistrationType | undefined =>
  registrationTypes.includes(value as BowlingRegistrationType)
    ? (value as BowlingRegistrationType)
    : undefined;

export default async function BowlingConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = (await searchParams) ?? {};
  const registrationId = getStringParam(params, "registrationId", "BFB-PENDING");
  const paymentParam = getStringParam(params, "payment", "card");
  const queryRegistrationType = getRegistrationTypeParam(getStringParam(params, "type"));
  const registration =
    registrationId !== "BFB-PENDING"
      ? await getBowlingRegistration(registrationId).catch(() => null)
      : null;
  const paymentPreference: BowlingPaymentPreference = ["card", "invoice", "check"].includes(paymentParam)
    ? (paymentParam as BowlingPaymentPreference)
    : "card";
  const registrationType = registration?.registrationType ?? queryRegistrationType ?? "team";
  const isGiftOnly = registrationType === "gift";
  const canManageTeam = registration
    ? needsSession(registration.registrationType) && registration.saveTeamLink
    : Boolean(queryRegistrationType && needsSession(queryRegistrationType));
  const registrationPaymentCopy: Record<BowlingPaymentPreference, string> = {
    card: "Your registration is saved and your card payment path is complete or underway. If anything needs attention, City Center will follow up directly.",
    invoice: `Your invoice request is saved. ${bowlingEventConfig.contactName}, City Center's ${bowlingEventConfig.contactTitle}, will follow up with invoice details and any final event notes.`,
    check: `Your check pledge is saved. ${bowlingEventConfig.contactName}, City Center's ${bowlingEventConfig.contactTitle}, will follow up with mailing or drop-off instructions if needed.`,
  };
  const giftPaymentCopy: Record<BowlingPaymentPreference, string> = {
    card: "Your gift is saved and your card payment path is complete or underway. If anything needs attention, City Center will follow up directly.",
    invoice: `Your gift pledge is saved. ${bowlingEventConfig.contactName}, City Center's ${bowlingEventConfig.contactTitle}, will follow up with invoice details if needed.`,
    check: `Your gift pledge is saved. ${bowlingEventConfig.contactName}, City Center's ${bowlingEventConfig.contactTitle}, will follow up with mailing or drop-off instructions if needed.`,
  };

  const registrationNextStepCopy: Record<BowlingPaymentPreference, string> = {
    card: "Watch for your email confirmation and keep your confirmation code handy.",
    invoice: "Our team will send invoice details to the contact email provided.",
    check: "Your spot is recorded. Our team will help with check instructions and any needed details.",
  };
  const giftNextStepCopy: Record<BowlingPaymentPreference, string> = {
    card: "Watch for your email confirmation and keep your gift reference handy.",
    invoice: "Our team will send any needed gift details to the contact email provided.",
    check: "Our team will help with check instructions and any needed gift details.",
  };
  const paymentCopy = isGiftOnly ? giftPaymentCopy : registrationPaymentCopy;
  const nextStepCopy = isGiftOnly ? giftNextStepCopy : registrationNextStepCopy;

  return (
    <main className="min-h-screen bg-bfb-cream py-16">
      <div className="bfb-shell max-w-4xl">
        <EventGatewayBackLink tone="bowling" />

        <section className="mt-8 rounded-sm border border-bfb-ink/10 bg-white p-8 shadow-soft sm:p-10">
          <CheckCircle2 aria-hidden="true" className="text-bfb-green" size={42} />
          <p className="bfb-eyebrow mt-8">{isGiftOnly ? "Gift received" : "You are in"}</p>
          <h1 className="mt-4 font-heading text-4xl font-black leading-tight text-bfb-ink sm:text-5xl">
            Thank you for helping students start the school year ready.
          </h1>
          <p className="bfb-copy mt-6">{paymentCopy[paymentPreference]}</p>
          <p className="mt-4 text-base leading-7 text-bfb-ink/70">
            {nextStepCopy[paymentPreference]}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-sm bg-bfb-light p-5">
              <Backpack aria-hidden="true" className="text-bfb-blue" size={24} />
              <p className="mt-4 text-sm font-bold uppercase text-bfb-ink/50">
                {isGiftOnly ? "Gift reference" : "Confirmation code"}
              </p>
              <p className="mt-2 break-all font-heading text-lg font-black text-bfb-ink">
                {registrationId}
              </p>
            </div>
            <div className="rounded-sm bg-bfb-light p-5">
              <CreditCard aria-hidden="true" className="text-bfb-blue" size={24} />
              <p className="mt-4 text-sm font-bold uppercase text-bfb-ink/50">
                Selected payment path
              </p>
              <p className="mt-2 font-heading text-lg font-black text-bfb-ink">
                {paymentPreferenceLabels[paymentPreference]}
              </p>
            </div>
          </div>

          {canManageTeam ? (
            <div className="mt-8 rounded-sm border border-bfb-green/35 bg-bfb-green/10 p-5">
              <ClipboardList aria-hidden="true" className="text-bfb-ink" size={23} />
              <h2 className="mt-4 font-heading text-xl font-black text-bfb-ink">
                Need to add bowler names later?
              </h2>
              <p className="mt-2 text-base leading-7 text-bfb-ink/70">
                Team captains can use this link to complete or update bowler names when they are ready:{" "}
                <Link
                  href={`${bowlingEventConfig.teamBaseUrl}/${registrationId}`}
                  className="break-all font-bold text-bfb-navy underline underline-offset-4"
                >
                  {bowlingEventConfig.teamBaseUrl}/{registrationId}
                </Link>
                .
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 rounded-sm border border-bfb-ink/10 bg-bfb-cream p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-xl font-black text-bfb-ink">
                Questions or changes?
              </h2>
              <p className="mt-2 text-base leading-7 text-bfb-ink/70">
                Send a note and our team will help with next steps.
              </p>
            </div>
            <a
              href={`mailto:${bowlingEventConfig.contactEmail}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-sm bg-bfb-navy px-5 py-3 font-heading text-sm font-bold uppercase text-white transition hover:bg-bfb-blue focus-visible:outline-bfb-blue"
            >
              <Mail aria-hidden="true" size={17} />
              Email City Center
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
