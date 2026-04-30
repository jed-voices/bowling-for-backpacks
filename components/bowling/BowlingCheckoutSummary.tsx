import { CreditCard, FileText, Landmark, MapPinned } from "lucide-react";
import {
  bowlingEventConfig,
  getSponsorshipById,
  paymentPreferenceLabels,
} from "@/lib/bowling/config";
import type {
  BowlingPaymentPreference,
  BowlingRegistrationInput,
  BowlingRegistrationRecord,
} from "@/lib/bowling/types";
import {
  formatCurrency,
  remainingLanes,
  remainingLanesFromRegistrations,
  selectedName,
  selectedPrice,
} from "@/lib/bowling/validation";

type BowlingCheckoutSummaryProps = {
  form: BowlingRegistrationInput;
  registrations?: BowlingRegistrationRecord[];
};

const paymentIcons = {
  card: CreditCard,
  invoice: FileText,
  check: Landmark,
};

export function BowlingCheckoutSummary({ form, registrations }: BowlingCheckoutSummaryProps) {
  const subtotal = selectedPrice(form);
  const donationTotal = Math.max(0, form.optionalGift || 0);
  const total = subtotal + donationTotal;
  const isGiftOnly = form.registrationType === "gift";
  const needsGiftAmount = isGiftOnly && donationTotal <= 0;
  const selectedSponsor = getSponsorshipById(form.packageId);
  const selectedSponsorLanes = selectedSponsor?.lanes ?? 1;
  const summaryNote =
    form.registrationType === "team"
      ? "Your team registration creates the captain link for bowler names after checkout or pledge submission."
      : form.registrationType === "sponsorship"
        ? `City Center will follow up on recognition, logo details, and the included ${selectedSponsorLanes === 1 ? "lane" : `${selectedSponsorLanes} lanes`}.`
        : form.registrationType === "lane-sponsor"
          ? "Your lane sponsorship is saved for City Center follow-up on recognition details."
          : `Your gift amount and selected payment preference will be sent to ${bowlingEventConfig.contactName}, City Center's ${bowlingEventConfig.contactTitle}, to confirm.`;
  const PaymentIcon = paymentIcons[form.paymentPreference as BowlingPaymentPreference];
  const sessionRemaining = form.sessionId
    ? registrations
      ? remainingLanesFromRegistrations(form.sessionId, registrations)
      : remainingLanes(form.sessionId)
    : null;

  return (
    <aside className="rounded-sm border border-bfb-ink/10 bg-white p-5 shadow-soft lg:sticky lg:top-6">
      <h3 className="font-heading text-xl font-black text-bfb-ink">Fast summary</h3>
      <div className="mt-5 space-y-4 text-sm">
        {!isGiftOnly ? (
          <div className="flex justify-between gap-4">
            <span className="text-bfb-ink/60">{selectedName(form)}</span>
            <span className="font-bold text-bfb-ink">{formatCurrency(subtotal)}</span>
          </div>
        ) : null}
        {form.sessionId ? (
          <div className="flex justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-bfb-ink/60">
              <MapPinned aria-hidden="true" size={15} />
              Session availability
            </span>
            <span className="font-bold text-bfb-ink">{sessionRemaining} team spots left</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <span className="text-bfb-ink/60">{isGiftOnly ? "Gift amount" : "Additional gift"}</span>
          <span className="font-bold text-bfb-ink">{formatCurrency(donationTotal)}</span>
        </div>
      </div>

      <div className="mt-5 border-t border-bfb-ink/10 pt-5">
        <div className="flex justify-between gap-4 text-lg">
          <span className="font-heading font-black text-bfb-ink">Total</span>
          <span className="font-heading font-black text-bfb-ink">{formatCurrency(total)}</span>
        </div>
        <p className="mt-3 flex gap-2 text-sm leading-6 text-bfb-ink/60">
          <PaymentIcon aria-hidden="true" className="mt-1 shrink-0 text-bfb-blue" size={16} />
          <span>{paymentPreferenceLabels[form.paymentPreference]}</span>
        </p>
        <p className="mt-4 rounded-sm bg-bfb-green/15 p-3 text-xs font-semibold leading-5 text-bfb-ink/70">
          {needsGiftAmount
            ? "Enter a gift amount below before finishing checkout."
            : summaryNote}
        </p>
        <p className="mt-3 text-xs font-semibold leading-5 text-bfb-ink/55">
          Questions? Email{" "}
          <a
            href={`mailto:${bowlingEventConfig.contactEmail}`}
            className="font-bold text-bfb-navy underline underline-offset-4"
          >
            {bowlingEventConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    </aside>
  );
}
