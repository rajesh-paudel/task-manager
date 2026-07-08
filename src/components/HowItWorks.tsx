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

export default function HowItWorks() {
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
            <span className="text-sm font-mono text-orange-600">
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
