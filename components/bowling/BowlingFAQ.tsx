import { bowlingEventConfig } from "@/lib/bowling/config";

const faqs = [
  {
    question: "What is the event theme?",
    answer:
      "Christmas in July. Think summer energy, light holiday touches, and a joyful night that keeps the focus on back-to-school support for students and families.",
  },
  {
    question: "How many people can bowl on a team?",
    answer:
      "Each team has six bowler spots. Team captains can register now and complete names later.",
  },
  {
    question: "What is the event timeline?",
    answer:
      "The Corporate Team Session runs from 2:00-4:00 PM, Business Networking runs from 4:15-5:15 PM, and the Community & Family Session runs from 5:30-7:30 PM.",
  },
  {
    question: "Can my company request an invoice?",
    answer:
      "Yes. Choose request invoice during registration and City Center will send invoice details to your contact email.",
  },
  {
    question: "Can I sponsor without bowling?",
    answer:
      "Yes. Lane sponsorships, event sponsorships, and gifts are available for supporters who want to help students start the year ready.",
  },
];

export function BowlingFAQ() {
  return (
    <section className="bg-bfb-light py-16 sm:py-20" aria-labelledby="bowling-faq">
      <div className="bfb-shell">
        <div className="max-w-3xl">
          <p className="bfb-eyebrow">Questions</p>
          <h2 id="bowling-faq" className="bfb-heading mt-4">
            A quick path from interest to registered.
          </h2>
        </div>
        <div className="mt-10 divide-y divide-bfb-ink/10 border-y border-bfb-ink/10">
          {faqs.map((faq) => (
            <article key={faq.question} className="grid gap-3 py-6 md:grid-cols-[0.4fr_1fr]">
              <h3 className="font-heading text-lg font-black text-bfb-ink">{faq.question}</h3>
              <p className="text-base leading-7 text-bfb-ink/70">{faq.answer}</p>
            </article>
          ))}
          <article className="grid gap-3 py-6 md:grid-cols-[0.4fr_1fr]">
            <h3 className="font-heading text-lg font-black text-bfb-ink">
              Who should I contact with questions?
            </h3>
            <p className="text-base leading-7 text-bfb-ink/70">
              {bowlingEventConfig.contactName}, City Center&apos;s{" "}
              {bowlingEventConfig.contactTitle}, is the point of contact for Bowling
              for Backpacks. Email{" "}
              <a
                href={`mailto:${bowlingEventConfig.contactEmail}`}
                className="font-bold text-bfb-navy underline underline-offset-4"
              >
                {bowlingEventConfig.contactEmail}
              </a>
              .
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
