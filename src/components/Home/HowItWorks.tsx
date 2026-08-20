import Reveal from "../ui/Reveal";

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up in seconds and start adding tasks right away — no setup or templates to fight with.",
  },
  {
    number: "02",
    title: "Organize your work",
    description:
      "Use list, kanban, or calendar views, set priorities and due dates, and filter to what matters.",
  },
  {
    number: "03",
    title: "Track your pulse",
    description:
      "Watch your overview chart completion, status, and priorities update in real time.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-y border-slate-200 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            From idea to done in three steps
          </h2>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-5xl gap-14 sm:grid-cols-3 sm:gap-8">
          {steps.map(({ number, title, description }, i) => (
            <Reveal key={number} delay={i * 0.1}>
              <div className="text-center sm:text-left">
                <span className="text-sm font-medium text-orange-600">{number}</span>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}