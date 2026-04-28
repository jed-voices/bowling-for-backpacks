import { CreditCard, FileText, Landmark, Ticket } from "lucide-react";
import { eventConfig, paymentPreferenceLabels } from "@/lib/gala/config";
import type { GalaPackage, PaymentPreference } from "@/lib/gala/types";
import { calculateTotals, formatCurrency } from "@/lib/gala/validation";

type CheckoutSummaryProps = {
  selectedPackage: GalaPackage;
  quantity: number;
  seats: number;
  optionalGift: number;
  chanceEntryQuantity: number;
  paymentPreference: PaymentPreference;
};

const paymentIcons = {
  card: CreditCard,
  invoice: FileText,
  check: Landmark,
};

export function CheckoutSummary({
  selectedPackage,
  quantity,
  seats,
  optionalGift,
  chanceEntryQuantity,
  paymentPreference,
}: CheckoutSummaryProps) {
  const totals = calculateTotals(
    selectedPackage,
    quantity,
    optionalGift,
    chanceEntryQuantity,
  );
  const PaymentIcon = paymentIcons[paymentPreference];

  return (
    <aside className="min-w-0 rounded-sm border border-sftc-ink/10 bg-white p-5 shadow-soft lg:sticky lg:top-6">
      <h3 className="font-heading text-xl font-semibold text-sftc-ink">Order summary</h3>
      <div className="mt-5 space-y-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-sftc-ink/60">{selectedPackage.name}</span>
          <span className="font-semibold text-sftc-ink">{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-sftc-ink/60">Seats included</span>
          <span className="font-semibold text-sftc-ink">{seats}</span>
        </div>
        {selectedPackage.category === "ticket" ? (
          <div className="flex justify-between gap-4">
            <span className="text-sftc-ink/60">Quantity</span>
            <span className="font-semibold text-sftc-ink">{quantity}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-sftc-ink/60">
            <Ticket aria-hidden="true" size={15} />
            Chance-to-win entries
          </span>
          <span className="font-semibold text-sftc-ink">
            {chanceEntryQuantity} / {formatCurrency(totals.chanceTotal)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-sftc-ink/60">Additional gift</span>
          <span className="font-semibold text-sftc-ink">{formatCurrency(totals.donationTotal)}</span>
        </div>
      </div>

      <div className="mt-5 border-t border-sftc-ink/12 pt-5">
        <div className="flex justify-between gap-4 text-lg">
          <span className="font-heading font-semibold text-sftc-ink">Total</span>
          <span className="font-heading font-semibold text-sftc-ink">
            {formatCurrency(totals.grandTotal)}
          </span>
        </div>
        <p className="mt-3 flex gap-2 text-sm leading-6 text-sftc-ink/60">
          <PaymentIcon aria-hidden="true" className="mt-1 shrink-0 text-sftc-brass" size={16} />
          <span>{paymentPreferenceLabels[paymentPreference]}</span>
        </p>
        <p className="mt-3 text-xs leading-5 text-sftc-ink/50">
          Chance-to-win entries are calculated at {formatCurrency(eventConfig.chanceEntryPrice)}
          each and should be activated only after official rules and tax language are approved.
        </p>
      </div>
    </aside>
  );
}
