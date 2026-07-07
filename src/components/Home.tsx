import {
  Layers,
  Zap,
  Users,
  BellRing,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <span className="text-xs font-semibold tracking-wide text-indigo-600 uppercase">
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
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Get started free
            <ArrowRight className="h-4 w-4" />
          </a>
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
                  className="h-7 w-7 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
          </div>

          <div className="px-5 py-2">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2 mb-4">
              <div className="h-full w-[57%] bg-indigo-600 rounded-full" />
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
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
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

function Features() {
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
            <div className="h-9 w-9 shrink-0 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
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

const steps = [
  {
    number: "01",
    title: "Create a board",
    description:
      "Set up a space for your project in seconds. No templates to fight with first.",
  },
  {
    number: "02",
    title: "Add the work",
    description: "Break it into tasks, assign owners, and set dates as you go.",
  },
  {
    number: "03",
    title: "Track the pulse",
    description: "Watch progress update live as your team checks things off.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100"
    >
      <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight max-w-lg">
        From idea to done in three steps
      </h2>

      <div className="mt-12 grid sm:grid-cols-3 gap-10">
        {steps.map((step) => (
          <div key={step.number}>
            <span className="text-sm font-mono text-indigo-600">
              {step.number}
            </span>
            <h3 className="mt-3 text-base font-semibold text-slate-900">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonial() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100">
      <blockquote className="max-w-2xl mx-auto text-center">
        <p className="text-xl sm:text-2xl text-slate-900 font-medium leading-snug">
          "We stopped losing track of who owned what. That alone paid for itself
          in the first week."
        </p>
        <footer className="mt-6 flex items-center justify-center gap-3">
          <img
            src="https://i.pravatar.cc/80?img=47"
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Meera Shah</p>
            <p className="text-xs text-slate-500">Ops Lead, Loop Studio</p>
          </div>
        </footer>
      </blockquote>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="bg-indigo-600 rounded-2xl px-8 py-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Your team's next sprint starts here.
        </h2>
        <p className="mt-3 text-sm text-indigo-100">
          Free for teams up to 10. No credit card required.
        </p>
        <a
          href="/register"
          className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50"
        >
          Get started free
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="bg-white font-sans">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonial />
      <CTABanner />
    </div>
  );
}
