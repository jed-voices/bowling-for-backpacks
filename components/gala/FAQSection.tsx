const faqs = [
  {
    question: "When will final event details be shared?",
    answer:
      "Registered guests will receive arrival details, auction access information, and any final timing updates as the Gala approaches.",
  },
  {
    question: "Can I submit guest names later?",
    answer:
      "Yes. Table hosts and ticket buyers can save the registration first and return to the guest-list link as names are confirmed.",
  },
  {
    question: "Can City Center invoice my organization?",
    answer:
      "Yes. Choose request invoice during registration and City Center will send the appropriate invoice details.",
  },
  {
    question: "Can I pay by check?",
    answer:
      "Yes. Choose pay later by check and City Center will share check instructions with your contact email.",
  },
  {
    question: "Are chance-to-win entries available now?",
    answer:
      "Chance-to-win details will be shared with official rules, eligibility, drawing information, and any required tax language before entries open.",
  },
];

export function FAQSection() {
  return (
    <section className="bg-sftc-stone py-20 sm:py-24" aria-labelledby="faq-heading">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">Questions</p>
          <h2 id="faq-heading" className="section-heading mt-4">
            A few helpful details before you reserve your place.
          </h2>
        </div>

        <div className="mt-10 divide-y divide-sftc-ink/12 border-y border-sftc-ink/12">
          {faqs.map((faq) => (
            <article key={faq.question} className="grid gap-3 py-6 md:grid-cols-[0.44fr_1fr]">
              <h3 className="font-heading text-lg font-semibold text-sftc-ink">{faq.question}</h3>
              <p className="text-base leading-7 text-sftc-ink/70">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
