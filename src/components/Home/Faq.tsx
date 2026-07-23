import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const faqs = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes — the Free plan covers up to 3 boards with unlimited tasks, no credit card required. Most individuals never need to upgrade.",
  },
  {
    question: "Can I import tasks from another tool?",
    answer:
      "You can import from a CSV file, and we're adding direct importers for the most common tools over time.",
  },
  {
    question: "Do you offer team/organization billing?",
    answer:
      "Yes — the Team plan bills per active member monthly, with a single invoice for the whole workspace rather than per-person charges.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Your data stays exportable for 30 days after cancellation. After that, it's permanently deleted from our systems.",
  },
  {
    question: "Is my data backed up?",
    answer:
      "Yes — all task and account data is backed up daily and retained for 30 days, so accidental deletions are recoverable.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100">
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight text-center">
        Common questions
      </h2>

      <div className="mt-10 divide-y divide-slate-100">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.question} className="py-4">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 text-left"
              >
                <span className="text-sm font-medium text-slate-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xl">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
