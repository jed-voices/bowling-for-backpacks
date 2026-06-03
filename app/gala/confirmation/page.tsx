import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardList, CreditCard, FileText } from "lucide-react";
import { EventGatewayBackLink } from "@/components/events/EventGatewayBackLink";
import { eventConfig, paymentPreferenceLabels } from "@/lib/gala/config";
import { verifyGalaAccessToken } from "@/lib/gala/entitlement";
import type { PaymentPreference } from "@/lib/gala/types";

export const metadata: Metadata = {
  title: "Registration Received",
};

type ConfirmationPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const paymentCopy: Record<PaymentPreference, string> = {
  card:
    "Your registration has been received. If a payment step is still needed, City Center will share the right next step with your contact email.",
  invoice:
    "Your invoice request has been received. City Center will send invoice details to your contact email.",
  check:
    "Your check pledge has been received. City Center will share check instructions with your contact email.",
};

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const params = (await searchParams) ?? {};
  const accessToken = typeof params.token === "string" ? params.token : "";
  const registrationId = verifyGalaAccessToken(accessToken);
  const paymentParam = typeof params.payment === "string" ? params.payment : "card";
  const paymentPreference: PaymentPreference = ["card", "invoice", "check"].includes(paymentParam)
    ? (paymentParam as PaymentPreference)
    : "card";

  if (!registrationId) {
    return (
      <main className="min-h-screen bg-sftc-ivory py-16">
        <div className="section-shell max-w-4xl">
          <EventGatewayBackLink tone="gala" />
          <section className="mt-8 rounded-sm border border-sftc-ink/10 bg-white p-8 shadow-soft sm:p-10">
            <p className="eyebrow">Link invalid</p>
            <h1 className="mt-4 font-display text-5xl font-medium leading-tight text-sftc-ink">
              This registration link is invalid or no longer available.
            </h1>
            <p className="body-copy mt-6">
              Please use the confirmation link from your registration flow or contact City Center for help.
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sftc-ivory py-16">
      <div className="section-shell max-w-4xl">
        <EventGatewayBackLink tone="gala" />

        <section className="mt-8 rounded-sm border border-sftc-ink/10 bg-white p-8 shadow-soft sm:p-10">
          <CheckCircle2 aria-hidden="true" className="text-sftc-hope" size={42} />
          <p className="eyebrow mt-8">Registration received</p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-tight text-sftc-ink">
            Thank you for helping carry the work forward.
          </h1>
          <p className="body-copy mt-6">{paymentCopy[paymentPreference]}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-sm bg-sftc-stone p-5">
              <FileText aria-hidden="true" className="text-sftc-brass" size={24} />
              <p className="mt-4 text-sm font-semibold uppercase text-sftc-ink/48">
                Registration ID
              </p>
              <p className="mt-2 break-all font-heading text-lg font-semibold text-sftc-ink">
                {registrationId}
              </p>
            </div>
            <div className="rounded-sm bg-sftc-stone p-5">
              <CreditCard aria-hidden="true" className="text-sftc-brass" size={24} />
              <p className="mt-4 text-sm font-semibold uppercase text-sftc-ink/48">
                Payment preference
              </p>
              <p className="mt-2 font-heading text-lg font-semibold text-sftc-ink">
                {paymentPreferenceLabels[paymentPreference]}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-sm border border-sftc-hope/35 bg-sftc-hope/10 p-5">
            <ClipboardList aria-hidden="true" className="text-sftc-ink" size={23} />
            <h2 className="mt-4 font-heading text-xl font-semibold text-sftc-ink">
              Guest-list link
            </h2>
            <p className="mt-2 text-base leading-7 text-sftc-ink/70">
              Table hosts can complete names later at{" "}
              <Link
                href={`${eventConfig.guestListBaseUrl}/${accessToken}`}
                className="font-semibold text-sftc-navy underline underline-offset-4"
              >
                {eventConfig.guestListBaseUrl}/{accessToken}
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
