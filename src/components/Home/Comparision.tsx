import { X, Check } from "lucide-react";
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
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
            Why switch
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            The old way vs. TaskPulse
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Stop herding work through chat threads. See what the whole team is
            doing, at a glance.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <Reveal delay={0.1} className="h-full">
            <div className="h-full rounded-2xl border border-slate-200 bg-white p-8">
              <h3 className="text-sm font-semibold text-slate-400">
                Scattered tools
              </h3>
              <ul className="mt-6 space-y-4">
                {oldWay.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-400">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100">
                      <X className="h-3 w-3 text-slate-400" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="h-full">
            <div className="h-full rounded-2xl border-2 border-orange-600 bg-white p-8">
              <h3 className="text-sm font-semibold text-orange-600">TaskPulse</h3>
              <ul className="mt-6 space-y-4">
                {taskPulseWay.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-slate-700">
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