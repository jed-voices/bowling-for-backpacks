"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Gift,
  Landmark,
  Upload,
  UsersRound,
} from "lucide-react";
import { BowlerListBuilder } from "./BowlerListBuilder";
import { BowlingCheckoutSummary } from "./BowlingCheckoutSummary";
import { EventGatewayBackLink } from "@/components/events/EventGatewayBackLink";
import {
  bowlingRegistrationOptions,
  getDefaultBowlingSponsorshipId,
  bowlingSessions,
  getSponsorshipById,
  paymentCtaLabels,
  paymentPreferenceLabels,
  registerableBowlingSponsorships,
  teamRegistration,
} from "@/lib/bowling/config";
import type {
  BowlingPaymentPreference,
  BowlingRegistrationInput,
  BowlingRegistrationRecord,
  BowlingRegistrationType,
} from "@/lib/bowling/types";
import {
  buildBowlerList,
  formatCurrency,
  getsTeamManagementLink,
  minimumGiftAmount,
  needsSession,
  remainingLanes,
  remainingLanesFromRegistrations,
  validateBowlingRegistrationInput,
} from "@/lib/bowling/validation";

const initialForm: BowlingRegistrationInput = {
  registrationType: "team",
  packageId: "team",
  buyerFirstName: "",
  buyerLastName: "",
  buyerEmail: "",
  buyerPhone: "",
  organization: "",
  teamName: "",
  sessionId: "corporate-session",
  bowlers: buildBowlerList(),
  sponsorLogoName: "",
  optionalGift: 0,
  notes: "",
  paymentPreference: "card",
  saveTeamLink: true,
};

const paymentIcons = {
  card: CreditCard,
  invoice: FileText,
  check: Landmark,
};

type SubmitState = "idle" | "submitting" | "error";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-2 text-sm font-bold text-red-700">{message}</p> : null;

type BowlingRegistrationFormProps = {
  registrations?: BowlingRegistrationRecord[];
};

export function BowlingRegistrationForm({ registrations }: BowlingRegistrationFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<BowlingRegistrationInput>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const selectedSponsor = useMemo(
    () => getSponsorshipById(form.packageId),
    [form.packageId],
  );
  const isGiftOnly = form.registrationType === "gift";
  const hasSessionSelection = needsSession(form.registrationType);
  const hasTeamManagement = getsTeamManagementLink(form.registrationType);
  const selectedSponsorLanes = selectedSponsor?.lanes ?? 1;
  const notesPlaceholder = hasTeamManagement
    ? "Team requests, accessibility notes, invoice notes, or questions"
    : form.registrationType === "sponsorship"
      ? "Recognition name, logo notes, included team questions, invoice notes, or questions"
      : form.registrationType === "lane-sponsor"
        ? "Lane recognition name, logo notes, invoice notes, or questions"
        : "Gift notes, dedication details, or questions";

  const updateForm = <Key extends keyof BowlingRegistrationInput>(
    key: Key,
    value: BowlingRegistrationInput[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key as string];
      return next;
    });
  };

  const selectRegistrationType = (registrationType: BowlingRegistrationType) => {
    setForm((current) => {
      const nextPackageId =
        registrationType === "team"
          ? teamRegistration.id
          : registrationType === "lane-sponsor"
            ? "lane-sponsor"
            : registrationType === "sponsorship"
              ? getDefaultBowlingSponsorshipId()
              : "gift";

      return {
        ...current,
        registrationType,
        packageId: nextPackageId,
        sessionId: needsSession(registrationType) ? current.sessionId || "corporate-session" : "",
        teamName: getsTeamManagementLink(registrationType) ? current.teamName : "",
        bowlers: getsTeamManagementLink(registrationType) ? buildBowlerList(current.bowlers) : [],
        saveTeamLink: getsTeamManagementLink(registrationType),
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setSubmitMessage("");

    const validation = validateBowlingRegistrationInput(form, "client-preview");

    if (!validation.ok) {
      setErrors(validation.errors);
      setSubmitState("error");
      setSubmitMessage("A few details need attention before we can finish this up.");
      return;
    }

    try {
      const response = await fetch("/api/bowling/register", {
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
        throw new Error("We could not save the registration. Please review the form and try again.");
      }

      if (form.paymentPreference === "card") {
        const checkoutResponse = await fetch("/api/bowling/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            registrationId: payload.registration.id,
            registrationInput: form,
          }),
        });
        const checkoutPayload = (await checkoutResponse.json()) as {
          url?: string;
          error?: string;
          errors?: Record<string, string>;
        };

        if (!checkoutResponse.ok || !checkoutPayload.url) {
          setErrors(checkoutPayload.errors ?? {});
          throw new Error(checkoutPayload.error ?? "We could not start checkout. Please try again or choose invoice/check.");
        }

        router.push(checkoutPayload.url);
        return;
      }

      router.push(
        `/bowling-for-backpacks/confirmation?registrationId=${payload.registration.id}&payment=${form.paymentPreference}&type=${form.registrationType}`,
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

  const giftAmountField = (
    <label>
      <span className="field-label">
        {isGiftOnly
          ? "Gift amount for backpacks and supplies"
          : "Add a gift for backpacks and supplies"}
      </span>
      <div className="relative">
        <Gift
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bfb-ink/35"
          size={17}
        />
        <input
          className="bfb-field pl-10"
          type="number"
          min={isGiftOnly ? minimumGiftAmount : 0}
          step={1}
          value={form.optionalGift}
          onChange={(event) => updateForm("optionalGift", Number(event.target.value) || 0)}
        />
      </div>
      <p className="mt-2 text-xs font-semibold leading-5 text-bfb-ink/55">
        Gifts start at {formatCurrency(minimumGiftAmount)}.
      </p>
      <FieldError message={errors.optionalGift} />
    </label>
  );

  return (
    <section
      id="registration"
      className="bg-bfb-cream py-20"
      aria-labelledby="bowling-registration"
    >
      <div className="bfb-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="rounded-sm border border-bfb-ink/10 bg-white p-5 shadow-soft sm:p-8"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <p className="bfb-eyebrow">Reserve your spot</p>
                <h2 id="bowling-registration" className="bfb-heading mt-4">
                  Register, sponsor, or support Back 2 School.
                </h2>
                <p className="bfb-copy mt-5">
                  This takes about two minutes. Choose how you want to
                  participate, add the basic contact details, and City Center
                  will follow up on anything that needs a human touch.
                </p>
              </div>
              <EventGatewayBackLink tone="bowling" className="shrink-0 self-start whitespace-nowrap" />
            </div>

            {submitMessage ? (
              <div
                className="mt-6 rounded-sm border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800"
                role="alert"
              >
                {submitMessage}
              </div>
            ) : null}

            <fieldset className="mt-9">
              <legend className="font-heading text-2xl font-black text-bfb-ink">
                Start here
              </legend>
              <p className="mt-2 text-sm leading-6 text-bfb-ink/65">
                Pick the option that fits. You can pay now, request an invoice, or pledge by check before submitting.
              </p>
              <FieldError message={errors.registrationType} />
              <div className="mt-5 grid gap-3 md:grid-cols-4">
                {bowlingRegistrationOptions.map((option) => {
                  const isSelected = form.registrationType === option.id;

                  return (
                    <label
                      key={option.id}
                      className={`cursor-pointer rounded-sm border p-4 transition ${
                        isSelected
                          ? "border-bfb-blue bg-bfb-blue/10"
                          : "border-bfb-ink/10 bg-white hover:border-bfb-blue/60"
                      }`}
                    >
                      <input
                        className="sr-only"
                        type="radio"
                        name="registrationType"
                        checked={isSelected}
                        onChange={() => selectRegistrationType(option.id)}
                      />
                      <span className="block font-heading text-base font-black text-bfb-ink">
                        {option.name}
                      </span>
                      <span className="mt-2 block text-sm font-bold text-bfb-navy">
                        {option.id === "sponsorship"
                          ? `Starting at ${formatCurrency(option.price)}`
                          : option.price > 0
                            ? formatCurrency(option.price)
                            : "Any amount"}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {form.registrationType === "sponsorship" ? (
              <fieldset className="mt-8">
                <legend className="field-label">Choose a sponsorship level</legend>
                <div className="grid gap-3 md:grid-cols-2">
                  {registerableBowlingSponsorships
                    .map((sponsor) => (
                      <label
                        key={sponsor.id}
                        className={`cursor-pointer rounded-sm border p-4 ${
                          form.packageId === sponsor.id
                            ? "border-bfb-green bg-bfb-green/10"
                            : "border-bfb-ink/10 bg-white"
                        }`}
                      >
                        <input
                          type="radio"
                          name="packageId"
                          checked={form.packageId === sponsor.id}
                          onChange={() => updateForm("packageId", sponsor.id)}
                        />
                        <span className="ml-2 font-heading font-black text-bfb-ink">
                          {sponsor.name}
                        </span>
                        <span className="mt-2 block text-sm font-bold text-bfb-navy">
                          {formatCurrency(sponsor.price)}
                        </span>
                        <span className="mt-2 block text-xs font-semibold leading-5 text-bfb-ink/60">
                          {sponsor.lanes} {sponsor.lanes === 1 ? "lane" : "lanes"} included.
                        </span>
                      </label>
                    ))}
                </div>
                <FieldError message={errors.packageId} />
                {selectedSponsor ? (
                  <p className="mt-3 text-sm leading-6 text-bfb-ink/65">
                    {selectedSponsor.description}
                  </p>
                ) : null}
              </fieldset>
            ) : null}

            {hasSessionSelection ? (
              <fieldset className="mt-8">
                <legend className="font-heading text-xl font-black text-bfb-ink">
                  Pick your preferred session
                </legend>
                <p className="mt-2 text-sm leading-6 text-bfb-ink/65">
                  {hasTeamManagement
                    ? "Each team registration reserves one team spot in a session. If you do not know every bowler yet, that is okay."
                    : `${selectedSponsor?.name ?? "This sponsorship"} includes ${selectedSponsorLanes} ${selectedSponsorLanes === 1 ? "lane" : "lanes"}. Choose a preferred session now, and City Center will confirm details with you directly.`}
                </p>
                <FieldError message={errors.sessionId} />
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {bowlingSessions.map((session) => {
                    const remaining = registrations
                      ? remainingLanesFromRegistrations(session.id, registrations)
                      : remainingLanes(session.id);
                    const isSelected = form.sessionId === session.id;
                    const requiredLanes = hasTeamManagement ? 1 : selectedSponsorLanes;
                    const hasEnoughLanes = remaining >= requiredLanes;

                    return (
                      <label
                        key={session.id}
                        className={`cursor-pointer rounded-sm border p-4 ${
                          isSelected
                            ? "border-bfb-blue bg-bfb-blue/10"
                            : "border-bfb-ink/10 bg-white hover:border-bfb-blue/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="sessionId"
                          checked={isSelected}
                          onChange={() => updateForm("sessionId", session.id)}
                          disabled={!hasEnoughLanes}
                        />
                        <span className="ml-2 font-heading font-black text-bfb-ink">
                          {session.name}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-bfb-ink/65">
                          {session.time}. {remaining > 0
                            ? hasEnoughLanes
                              ? `${remaining} of ${session.laneCapacity} team spots still available.`
                              : `${remaining} team spots remain, but this level needs ${requiredLanes}.`
                            : "This session is currently full. Choose another session and our team can help with options."}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ) : null}

            {isGiftOnly ? (
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {giftAmountField}
              </div>
            ) : null}

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <label>
                <span className="field-label">First name</span>
                <input
                  className="bfb-field"
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
                  className="bfb-field"
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
                  className="bfb-field"
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
                  className="bfb-field"
                  value={form.buyerPhone}
                  onChange={(event) => updateForm("buyerPhone", event.target.value)}
                  autoComplete="tel"
                />
              </label>
              <label className="md:col-span-2">
                <span className="field-label">Company, church, family, or organization</span>
                <div className="relative">
                  <Building2
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bfb-ink/35"
                    size={17}
                  />
                  <input
                    className="bfb-field pl-10"
                    value={form.organization}
                    onChange={(event) => updateForm("organization", event.target.value)}
                    autoComplete="organization"
                  />
                </div>
              </label>
              {hasTeamManagement ? (
                <label>
                  <span className="field-label">Team name</span>
                  <input
                    className="bfb-field"
                    value={form.teamName}
                    onChange={(event) => updateForm("teamName", event.target.value)}
                    placeholder="Optional. You can add this later."
                  />
                </label>
              ) : null}
              {form.registrationType === "sponsorship" || form.registrationType === "lane-sponsor" ? (
                <label className={hasSessionSelection ? "" : "md:col-span-2"}>
                  <span className="field-label">Sponsor logo or website</span>
                  <div className="rounded-sm border border-bfb-ink/10 bg-bfb-cream p-4">
                    <div className="relative">
                      <Upload aria-hidden="true" className="text-bfb-blue" size={21} />
                      <input
                        className="bfb-field mt-3"
                        value={form.sponsorLogoName}
                        onChange={(event) => updateForm("sponsorLogoName", event.target.value)}
                        placeholder="Drive link, website URL, or filename"
                      />
                    </div>
                    <p className="mt-3 text-sm text-bfb-ink/60">
                      Optional. If you do not have it handy, we can collect it after registration.
                    </p>
                  </div>
                </label>
              ) : null}
              <label className="md:col-span-2">
                <span className="field-label">Anything we should know?</span>
                <textarea
                  className="bfb-field min-h-24"
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder={notesPlaceholder}
                />
              </label>
            </div>

            {hasTeamManagement ? (
              <div className="mt-9">
                <BowlerListBuilder
                  bowlers={form.bowlers}
                  onChange={(bowlers) => updateForm("bowlers", bowlers)}
                />
              </div>
            ) : null}

            {!isGiftOnly ? (
              <div className="mt-9 grid gap-5 md:grid-cols-2">
                {giftAmountField}
              </div>
            ) : null}

            <fieldset className="mt-9">
              <legend className="font-heading text-xl font-black text-bfb-ink">
                How would you like to finish?
              </legend>
              <p className="mt-2 text-sm leading-6 text-bfb-ink/65">
                Online card payment is fastest. Invoice and check options let
                City Center send the right next step to your contact email.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {(Object.keys(paymentPreferenceLabels) as BowlingPaymentPreference[]).map((preference) => {
                  const Icon = paymentIcons[preference];
                  const isSelected = form.paymentPreference === preference;

                  return (
                    <label
                      key={preference}
                      className={`cursor-pointer rounded-sm border p-4 ${
                        isSelected
                          ? "border-bfb-green bg-bfb-green/10"
                          : "border-bfb-ink/10 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentPreference"
                        checked={isSelected}
                        onChange={() => updateForm("paymentPreference", preference)}
                      />
                      <span className="ml-2 inline-flex items-center gap-2 font-heading font-black text-bfb-ink">
                        <Icon aria-hidden="true" size={18} />
                        {paymentPreferenceLabels[preference]}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            {hasTeamManagement ? (
              <label className="mt-7 flex gap-3 rounded-sm bg-bfb-green/15 p-4">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={form.saveTeamLink}
                  onChange={(event) => updateForm("saveTeamLink", event.target.checked)}
                />
                <span>
                  <span className="flex items-center gap-2 font-heading font-black text-bfb-ink">
                    <UsersRound aria-hidden="true" size={18} />
                    Let me update bowlers later
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-bfb-ink/60">
                    We will save a team link so your captain can add or edit names after registering.
                  </span>
                </span>
              </label>
            ) : null}

            <button
              className="bfb-primary mt-8 w-full sm:w-auto"
              type="submit"
              disabled={submitState === "submitting"}
            >
              {submitState === "submitting"
                ? isGiftOnly
                  ? "Processing your gift..."
                  : "Securing your spot..."
                : paymentCtaLabels[form.paymentPreference]}
              {form.paymentPreference === "card" ? (
                <CreditCard aria-hidden="true" size={17} />
              ) : (
                <CheckCircle2 aria-hidden="true" size={17} />
              )}
            </button>
            <p className="mt-4 text-sm leading-6 text-bfb-ink/60">
              After you submit, you will receive confirmation and City Center will follow up if anything else is needed.
            </p>
          </form>

          <BowlingCheckoutSummary form={form} registrations={registrations} />
        </div>
      </div>
    </section>
  );
}
