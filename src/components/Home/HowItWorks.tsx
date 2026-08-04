import { ClipboardList, PlusCircle, Activity } from "lucide-react";
import Reveal from "../ui/Reveal";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Create a board",
    description:
      "Set up a space for your project in seconds. No templates to fight with first.",
  },
  {
    number: "02",
    icon: PlusCircle,
    title: "Add the work",
    description: "Break it into tasks, assign owners, and set dates as you go.",
  },
  {
    number: "03",
    icon: Activity,
    title: "Track the pulse",
    description: "Watch progress update live as your team checks things off.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 border-t border-slate-200 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-600">How it works</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          From idea to done in three steps
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          No setup marathon. You'll be tracking your first task within a minute.
        </p>
      </Reveal>

      <div className="relative mt-16 grid gap-12 sm:grid-cols-3 sm:gap-8">
        {/* Connector line */}
        <div className="absolute top-7 left-[16.66%] right-[16.66%] hidden h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent dark:via-orange-500/40 sm:block" aria-hidden="true" />

        {steps.map(({ number, icon: Icon, title, description }, i) => (
          <Reveal key={number} delay={i * 0.15} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30">
                <Icon className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-[10px] font-bold text-white dark:bg-slate-950">
                  {number}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">{description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
