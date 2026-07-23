import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <span className="text-xs font-semibold tracking-wide text-orange-600 uppercase">
          For teams, not for busywork
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.1]">
          Plan the work.
          <br />
          Skip the chaos.
        </h1>
        <p className="mt-5 text-base text-slate-500 max-w-md leading-relaxed">
          TaskPulse keeps every task, deadline, and update in one place — so
          your team spends less time managing work and more time doing it.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            See how it works
          </a>
        </div>
      </div>

      {/* Product mockup */}
      <div className="relative">
        <div className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Website redesign
              </p>
              <p className="text-xs text-slate-400">4 of 7 tasks done</p>
            </div>
            <div className="flex -space-x-2">
              {["12", "32", "54"].map((id) => (
                  <img
                    key={id}
                    src={`https://i.pravatar.cc/64?img=${id}`}
                    alt=""
                    loading="lazy"
                    className="h-7 w-7 rounded-full border-2 border-white object-cover"
                  />
              ))}
            </div>
          </div>

          <div className="px-5 py-2">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2 mb-4">
              <div className="h-full w-[57%] bg-orange-600 rounded-full" />
            </div>

            <ul className="divide-y divide-slate-100">
              {[
                { label: "Wireframe homepage", done: true, meta: "Done" },
                { label: "Review copy with Sarah", done: false, meta: "Today" },
                {
                  label: "Client feedback call",
                  done: false,
                  meta: "Tomorrow",
                },
                { label: "Ship staging build", done: false, meta: "Fri" },
              ].map((task) => (
                <li key={task.label} className="flex items-center gap-3 py-3">
                  {task.done ? (
                    <CheckCircle2 className="h-4 w-4 text-orange-600 shrink-0" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0" />
                  )}
                  <span
                    className={`text-sm flex-1 ${
                      task.done
                        ? "text-slate-400 line-through"
                        : "text-slate-700"
                    }`}
                  >
                    {task.label}
                  </span>
                  <span className="text-xs text-slate-400">{task.meta}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
