"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  Landmark,
  Minus,
  Plus,
  Upload,
  UsersRound,
} from "lucide-react";
import { CheckoutSummary } from "./CheckoutSummary";
import { GuestListBuilder } from "./GuestListBuilder";
import {
  eventConfig,
  galaPackages,
  getPackageById,
  paymentCtaLabels,
  paymentPreferenceLabels,
  sponsorships,
  ticketOptions,
} from "@/lib/gala/config";
import type { GalaRegistrationInput, PaymentPreference } from "@/lib/gala/types";
import {
  blankGuest,
  buildGuestList,
  calculateSeats,
  formatCurrency,
  validateRegistrationInput,
} from "@/lib/gala/validation";

const initialPackage = getPackageById("legacy-table") ?? galaPackages[0];
const initialSeats = calculateSeats(initialPackage, 1);

const initialForm: GalaRegistrationInput = {
  buyerFirstName: "",
  buyerLastName: "",
  buyerEmail: "",
  buyerPhone: "",
  organization: "",
  address: "",
  cityStateZipCode: "",
  affiliate: "",
  groupName: "",
  tableRequest: "",
  admitInfo: "",
  packageId: initialPackage.id,
  quantity: 1,
  guests: buildGuestList(initialSeats, [blankGuest()]),
  sponsorLogoName: "",
  notes: "",
  optionalGift: 0,
  chanceEntryQuantity: 0,
  paymentPreference: "card",
  sendGuestListLink: true,
};

const paymentIcons = {
  card: CreditCard,
  invoice: FileText,
  check: Landmark,
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-2 text-sm font-semibold text-red-700">{message}</p> : null;

export function RegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState<GalaRegistrationInput>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const selectedPackage = useMemo(
    () => getPackageById(form.packageId) ?? initialPackage,
    [form.packageId],
  );

  const seats = useMemo(
    () => calculateSeats(selectedPackage, form.quantity),
    [selectedPackage, form.quantity],
  );

  const updateForm = <Key extends keyof GalaRegistrationInput>(
    key: Key,
    value: GalaRegistrationInput[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  };

  const selectPackage = (packageId: string) => {
    const nextPackage = getPackageById(packageId);

    if (!nextPackage) {
      return;
    }

    setForm((current) => {
      const quantity = nextPackage.category === "sponsorship" ? 1 : current.quantity;
      const nextSeats = calculateSeats(nextPackage, quantity);

      return {
        ...current,
        packageId,
        quantity,
        guests: buildGuestList(nextSeats, current.guests),
      };
    });
  };

  const updateQuantity = (nextQuantity: number) => {
    const safeQuantity = Math.max(1, nextQuantity);
    setForm((current) => {
      const nextSeats = calculateSeats(selectedPackage, safeQuantity);

      return {
        ...current,
        quantity: safeQuantity,
        guests: buildGuestList(nextSeats, current.guests),
      };
    });
  };

  const updatePaymentPreference = (paymentPreference: PaymentPreference) => {
    updateForm("paymentPreference", paymentPreference);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setSubmitMessage("");

    const validation = validateRegistrationInput(form, "client-preview");

    if (!validation.ok) {
      setErrors(validation.errors);
      setSubmitState("error");
      setSubmitMessage("Please review the highlighted fields before continuing.");
      return;
    }

    try {
      const response = await fetch("/api/gala/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as {
        registration?: { id: string };
        errors?: Record<string, string>;
      };

      if (!response.ok || !payload.registration) {
        setErrors(payload.errors ?? {});
        throw new Error("Registration could not be saved.");
      }

      if (form.paymentPreference === "card") {
        const checkoutResponse = await fetch("/api/gala/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationId: payload.registration.id }),
        });
        const checkoutPayload = (await checkoutResponse.json()) as { url?: string };

        if (!checkoutResponse.ok || !checkoutPayload.url) {
          throw new Error("Checkout could not be started.");
        }

        router.push(checkoutPayload.url);
        return;
      }

      router.push(
        `/gala/confirmation?registrationId=${payload.registration.id}&payment=${form.paymentPreference}`,
      );
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the registration.",
      );
    }
  };

  return (
    <section
      id="registration"
      className="bg-sftc-ivory py-20 sm:py-24"
      aria-labelledby="registration-heading"
    >
      <div className="section-shell">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="min-w-0 rounded-sm border border-sftc-ink/10 bg-white p-5 shadow-soft sm:p-8"
          >
            <div className="max-w-3xl">
              <p className="eyebrow">Registration</p>
              <h2 id="registration-heading" className="section-heading mt-4">
                Reserve your place at Stories From the Center.
              </h2>
              <p className="body-copy mt-5">
                Choose a sponsorship or ticket option, add guest details, and select the
                payment path that works best for you or your organization.
              </p>
            </div>

            {submitMessage ? (
              <div
                className={`mt-6 rounded-sm border p-4 text-sm font-semibold ${
                  submitState === "error"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-sftc-hope/40 bg-sftc-hope/10 text-sftc-ink"
                }`}
                role={submitState === "error" ? "alert" : "status"}
              >
                {submitMessage}
              </div>
            ) : null}

            <fieldset className="mt-10 min-w-0">
              <legend className="font-heading text-2xl font-semibold text-sftc-ink">
                Sponsorships and tickets
              </legend>
              <FieldError message={errors.packageId} />

              <div className="mt-5 min-w-0 space-y-6">
                <PackagePicker
                  title="Sponsorships"
                  packages={sponsorships}
                  selectedId={form.packageId}
                  onSelect={selectPackage}
                />
                <PackagePicker
                  title="Tickets"
                  packages={ticketOptions}
                  selectedId={form.packageId}
                  onSelect={selectPackage}
                />
              </div>
            </fieldset>

            {selectedPackage.category === "ticket" ? (
              <div className="mt-8 rounded-sm bg-sftc-stone p-5">
                <label className="field-label" htmlFor="ticket-quantity">
                  Ticket quantity
                </label>
                <div className="flex w-full max-w-xs items-center gap-3">
                  <button
                    className="button-quiet aspect-square min-h-12 w-12 p-0"
                    type="button"
                    onClick={() => updateQuantity(form.quantity - 1)}
                    aria-label="Decrease ticket quantity"
                  >
                    <Minus aria-hidden="true" size={17} />
                  </button>
                  <input
                    id="ticket-quantity"
                    className="field-input text-center"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(event) => updateQuantity(Number(event.target.value) || 1)}
                  />
                  <button
                    className="button-quiet aspect-square min-h-12 w-12 p-0"
                    type="button"
                    onClick={() => updateQuantity(form.quantity + 1)}
                    aria-label="Increase ticket quantity"
                  >
                    <Plus aria-hidden="true" size={17} />
                  </button>
                </div>
                <p className="field-help">
                  This selection currently includes {seats} {seats === 1 ? "seat" : "seats"}.
                </p>
              </div>
            ) : null}

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <label>
                <span className="field-label">First name</span>
                <input
                  className="field-input"
                  value={form.buyerFirstName}
                  onChange={(event) => updateForm("buyerFirstName", event.target.value)}
                  aria-invalid={Boolean(errors.buyerFirstName)}
                  autoComplete="given-name"
                />
                <FieldError message={errors.buyerFirstName} />
              </label>
              <label>
                <span className="field-label">Last name</span>
                <input
                  className="field-input"
                  value={form.buyerLastName}
                  onChange={(event) => updateForm("buyerLastName", event.target.value)}
                  aria-invalid={Boolean(errors.buyerLastName)}
                  autoComplete="family-name"
                />
                <FieldError message={errors.buyerLastName} />
              </label>
              <label>
                <span className="field-label">Email</span>
                <input
                  className="field-input"
                  type="email"
                  value={form.buyerEmail}
                  onChange={(event) => updateForm("buyerEmail", event.target.value)}
                  aria-invalid={Boolean(errors.buyerEmail)}
                  autoComplete="email"
                />
                <FieldError message={errors.buyerEmail} />
              </label>
              <label>
                <span className="field-label">Phone</span>
                <input
                  className="field-input"
                  value={form.buyerPhone}
                  onChange={(event) => updateForm("buyerPhone", event.target.value)}
                  autoComplete="tel"
                />
              </label>
              <label className="md:col-span-2">
                <span className="field-label">Organization or company</span>
                <div className="relative">
                  <Building2
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sftc-ink/35"
                    size={17}
                  />
                  <input
                    className="field-input pl-10"
                    value={form.organization}
                    onChange={(event) => updateForm("organization", event.target.value)}
                    placeholder="Optional for individual guests"
                    autoComplete="organization"
                  />
                </div>
              </label>
              <label className="md:col-span-2">
                <span className="field-label">Address</span>
                <input
                  className="field-input"
                  value={form.address}
                  onChange={(event) => updateForm("address", event.target.value)}
                  autoComplete="street-address"
                />
              </label>
              <label>
                <span className="field-label">City, state, ZIP</span>
                <input
                  className="field-input"
                  value={form.cityStateZipCode}
                  onChange={(event) => updateForm("cityStateZipCode", event.target.value)}
                  placeholder="Oklahoma City, OK 73102"
                />
              </label>
              <label>
                <span className="field-label">Affiliate or relationship</span>
                <input
                  className="field-input"
                  value={form.affiliate}
                  onChange={(event) => updateForm("affiliate", event.target.value)}
                  placeholder="Board, sponsor, church, friend, partner"
                />
              </label>
              <label>
                <span className="field-label">Group name</span>
                <input
                  className="field-input"
                  value={form.groupName}
                  onChange={(event) => updateForm("groupName", event.target.value)}
                  placeholder="Table host or guest group"
                />
              </label>
              <label>
                <span className="field-label">Table request</span>
                <input
                  className="field-input"
                  value={form.tableRequest}
                  onChange={(event) => updateForm("tableRequest", event.target.value)}
                  placeholder="Seat with..."
                />
              </label>
              <label className="md:col-span-2">
                <span className="field-label">Admit info</span>
                <input
                  className="field-input"
                  value={form.admitInfo}
                  onChange={(event) => updateForm("admitInfo", event.target.value)}
                  placeholder="Anything City Center should know for check-in"
                />
              </label>
              <label className="min-w-0 md:col-span-2">
                <span className="field-label">Sponsor logo upload placeholder</span>
                <div className="flex flex-col gap-3 rounded-sm border border-dashed border-sftc-ink/22 bg-sftc-ivory p-4 sm:flex-row sm:items-center">
                  <Upload aria-hidden="true" className="text-sftc-brass" size={22} />
                  <div className="min-w-0 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="max-w-full text-sm"
                      onChange={(event) =>
                        updateForm("sponsorLogoName", event.target.files?.[0]?.name ?? "")
                      }
                    />
                    <p className="field-help">
                      Logo storage is intentionally not wired yet. Selected file name:
                      {" "}
                      {form.sponsorLogoName || "none"}
                    </p>
                  </div>
                </div>
              </label>
            </div>

            <div className="mt-10">
              <GuestListBuilder
                seats={seats}
                guests={form.guests}
                onChange={(guests) => updateForm("guests", guests)}
              />
            </div>

            <fieldset className="mt-10 grid min-w-0 gap-5 md:grid-cols-2">
              <legend className="md:col-span-2 font-heading text-2xl font-semibold text-sftc-ink">
                Giving and payment
              </legend>
              <label>
                <span className="field-label">Optional additional gift</span>
                <input
                  className="field-input"
                  type="number"
                  min={0}
                  step={25}
                  value={form.optionalGift}
                  onChange={(event) => updateForm("optionalGift", Number(event.target.value) || 0)}
                />
                <FieldError message={errors.optionalGift} />
              </label>
              <label>
                <span className="field-label">Chance-to-win entries</span>
                <input
                  className="field-input"
                  type="number"
                  min={0}
                  value={form.chanceEntryQuantity}
                  onChange={(event) =>
                    updateForm("chanceEntryQuantity", Number(event.target.value) || 0)
                  }
                />
                <p className="field-help">
                  {formatCurrency(eventConfig.chanceEntryPrice)} per entry. Entries should be
                  issued only after payment or City Center approval.
                </p>
                <FieldError message={errors.chanceEntryQuantity} />
              </label>
              <label className="md:col-span-2">
                <span className="field-label">Special notes</span>
                <textarea
                  className="field-input min-h-28"
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder="Accessibility notes, guest needs, or anything City Center should know"
                />
              </label>
            </fieldset>

            <fieldset className="mt-10 min-w-0">
              <legend className="font-heading text-2xl font-semibold text-sftc-ink">
                Payment preference
              </legend>
              <FieldError message={errors.paymentPreference} />
              <div className="mt-5 grid min-w-0 gap-3 md:grid-cols-3">
                {(Object.keys(paymentPreferenceLabels) as PaymentPreference[]).map((preference) => {
                  const Icon = paymentIcons[preference];
                  const isSelected = form.paymentPreference === preference;

                  return (
                    <label
                      key={preference}
                      className={`flex cursor-pointer gap-3 rounded-sm border p-4 transition ${
                        isSelected
                          ? "border-sftc-brass bg-sftc-ivory"
                          : "border-sftc-ink/12 bg-white hover:border-sftc-brass/70"
                      }`}
                    >
                      <input
                        type="radio"
                        className="mt-1"
                        name="paymentPreference"
                        value={preference}
                        checked={isSelected}
                        onChange={() => updatePaymentPreference(preference)}
                      />
                      <span>
                        <span className="flex items-center gap-2 font-heading font-semibold text-sftc-ink">
                          <Icon aria-hidden="true" size={18} />
                          {paymentPreferenceLabels[preference]}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-sftc-ink/60">
                          {preference === "card"
                            ? "Choose a secure card payment path."
                            : preference === "invoice"
                              ? "City Center will send invoice details to your contact email."
                              : "City Center will share check instructions with your contact email."}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <label className="mt-8 flex gap-3 rounded-sm bg-sftc-stone p-4">
              <input
                className="mt-1"
                type="checkbox"
                checked={form.sendGuestListLink}
                onChange={(event) => updateForm("sendGuestListLink", event.target.checked)}
              />
              <span>
                <span className="flex items-center gap-2 font-heading font-semibold text-sftc-ink">
                  <UsersRound aria-hidden="true" size={18} />
                  Save and send guest-list link
                </span>
                <span className="mt-2 block text-sm leading-6 text-sftc-ink/60">
                  This keeps table hosts from needing every guest name before reserving seats.
                </span>
              </span>
            </label>

            <button
              className="button-primary mt-8 w-full sm:w-auto"
              type="submit"
              disabled={submitState === "submitting"}
            >
              {submitState === "submitting" ? "Saving..." : paymentCtaLabels[form.paymentPreference]}
              {form.paymentPreference === "card" ? (
                <CreditCard aria-hidden="true" size={17} />
              ) : (
                <CheckCircle2 aria-hidden="true" size={17} />
              )}
            </button>
          </form>

          <CheckoutSummary
            selectedPackage={selectedPackage}
            quantity={form.quantity}
            seats={seats}
            optionalGift={form.optionalGift}
            chanceEntryQuantity={form.chanceEntryQuantity}
            paymentPreference={form.paymentPreference}
          />
        </div>
      </div>
    </section>
  );
}

type PackagePickerProps = {
  title: string;
  packages: typeof sponsorships;
  selectedId: string;
  onSelect: (packageId: string) => void;
};

function PackagePicker({ title, packages, selectedId, onSelect }: PackagePickerProps) {
  return (
    <div className="min-w-0">
      <h3 className="font-heading text-sm font-semibold uppercase text-sftc-ink/52">
        {title}
      </h3>
      <div className="mt-3 min-w-0 divide-y divide-sftc-ink/10 overflow-hidden rounded-sm border border-sftc-ink/10">
        {packages.map((item) => {
          const isSelected = selectedId === item.id;

          return (
            <label
              key={item.id}
              className={`grid min-w-0 cursor-pointer gap-3 p-4 transition md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center ${
                isSelected ? "bg-sftc-ivory" : "bg-white hover:bg-sftc-stone/65"
              }`}
            >
              <input
                type="radio"
                name="packageId"
                value={item.id}
                checked={isSelected}
                onChange={() => onSelect(item.id)}
              />
              <span className="min-w-0">
                <span className="flex min-w-0 flex-wrap items-center gap-3 font-heading font-semibold text-sftc-ink">
                  {item.name}
                  {item.label ? (
                    <span className="rounded-sm bg-sftc-hope/18 px-2 py-1 text-xs font-semibold uppercase text-sftc-ink/70">
                      {item.label}
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block break-words text-sm leading-6 text-sftc-ink/60">
                  {item.seats} {item.seats === 1 ? "seat" : "seats"} / Package{" "}
                  {item.greaterGivingPackageNumber}
                </span>
              </span>
              <span className="flex items-center justify-between gap-3 font-heading text-lg font-semibold text-sftc-ink md:justify-end">
                {formatCurrency(item.price)}
                <ChevronDown aria-hidden="true" className="text-sftc-brass md:hidden" size={17} />
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
