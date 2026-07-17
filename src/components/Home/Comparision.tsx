import { X, Check } from "lucide-react";

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
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100">
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight text-center">
        The old way vs. TaskPulse
      </h2>

      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
            Scattered tools
          </h3>
          <ul className="mt-5 space-y-3.5">
            {oldWay.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-slate-500"
              >
                <X className="h-4 w-4 text-slate-300 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-orange-600 p-6 bg-white">
          <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
            TaskPulse
          </h3>
          <ul className="mt-5 space-y-3.5">
            {taskPulseWay.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-slate-900"
              >
                <Check className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
