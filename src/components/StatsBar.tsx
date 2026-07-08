const stats = [
  { value: "2,400+", label: "Teams onboarded" },
  { value: "1.8M", label: "Tasks completed" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.8/5", label: "Average rating" },
];

export default function StatsBar() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <p className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
