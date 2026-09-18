import { eventConfig } from "@/lib/gala/config";

const faqs = [
  {
    question: "Where do I register?",
    answer:
      "Registration, table purchases, and gifts are handled on Greater Giving, City Center's event partner. Use any Register button on this page.",
  },
  {
    question: "When does registration close?",
    answer: `Online registration closes ${eventConfig.registrationCloses}.`,
  },
  {
    question: "What should I wear?",
    answer: "Business casual.",
  },
  {
    question: "Can I pay by check or get an invoice?",
    answer: `Yes. Checks can be mailed to ${eventConfig.checkMailingAddress}. For an invoice, email ${eventConfig.contactEmail} and we'll send one.`,
  },
  {
    question: "Can I send guest names later?",
    answer: `Yes. Register your table or tickets now and send guest names to ${eventConfig.contactEmail} when they're confirmed.`,
  },
  {
    question: "I can't attend. Can I still give?",
    answer:
      "Yes. Gifts of any amount can be made on the same Greater Giving page, and every gift supports City Center's year-round work.",
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
