import { X, Check, Crown } from "lucide-react";
import Reveal from "../ui/Reveal";

const oldWay = [
  "Tasks scattered across sticky notes, chats, and email",
  "No one's sure who owns what until standup",
  "Deadlines live in someone's head, not the tool",
  "Status updates mean writing a summary by hand",
];

const taskPulseWay = [
  "One board holds every task, in one place",
  "Every task has a clear owner from the start",
  "Due dates are visible on the task, not guessed at",
  "Progress is visible without asking anyone",
];

export default function Comparison() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-600">Why switch</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          The old way vs. TaskPulse
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          Stop herding work through chat threads. See what the whole team is doing, at a glance.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border border-dashed border-slate-300 p-7 sm:p-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Scattered tools
            </h3>
            <ul className="mt-6 space-y-4">
              {oldWay.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-500 line-through decoration-slate-300">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <X className="h-3 w-3 text-slate-400" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="relative h-full overflow-hidden rounded-2xl border-2 border-orange-500 bg-gradient-to-b from-orange-50 to-white p-7 shadow-xl shadow-orange-500/10 dark:from-orange-500/15 dark:to-slate-50 sm:p-8">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-400/20 blur-3xl" aria-hidden="true" />
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-orange-600">
                TaskPulse
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-600 px-2.5 py-1 text-[10px] font-bold text-white">
                <Crown className="h-3 w-3" />
                RECOMMENDED
              </span>
            </div>
            <ul className="mt-6 space-y-4">
              {taskPulseWay.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-slate-800">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-600">
                    <Check className="h-3 w-3 text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
