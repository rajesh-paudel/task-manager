import { Layers, Zap, Users, BellRing } from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "Boards that adapt",
    description:
      "Switch between list, board, and timeline views for the same project — no re-entering data.",
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
];

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100">
      <div className="max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Everything the work needs, nothing it doesn't
        </h2>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-10">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex gap-4">
            <div className="h-9 w-9 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
