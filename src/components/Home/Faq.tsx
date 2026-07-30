import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "../../utils/faqs";


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
                    isOpen ? "rotate-180 ease-in-out duration-300" : ""
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
