import { BarChart3, BellRing, CalendarDays, Layers, Users, Zap } from "lucide-react";
import Reveal from "../ui/Reveal";

const features = [
  {
    icon: Layers,
    title: "Boards that adapt",
    description:
      "Switch between list, board, and calendar views for the same project — no re-entering data.",
  },
  {
    icon: Zap,
    title: "Quick to capture",
    description:
      "Add a task in one line and refine it later. Nothing waits on a form to get written down.",
  },
  {
    icon: Users,
    title: "Clear ownership",
    description:
      "Every task has one owner and a due date, so status updates stop needing a meeting.",
  },
  {
    icon: BellRing,
    title: "Updates that find you",
    description:
      "Get notified when your work changes, and nothing else. No noisy, all-team channels.",
  },
  {
    icon: CalendarDays,
    title: "Calendar you can plan on",
    description:
      "See every deadline in a month view and drag work into shape in seconds.",
  },
  {
    icon: BarChart3,
    title: "Progress you can measure",
    description:
      "Completion rates, velocity, and workload — charted on your overview.",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
          Features
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Everything you need, nothing you don't
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          A focused workspace for planning, tracking, and shipping your team's work.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }, i) => (
          <Reveal key={title} delay={i * 0.05} className="h-full">
            <div className="group h-full bg-white p-7 transition-colors hover:bg-slate-50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}