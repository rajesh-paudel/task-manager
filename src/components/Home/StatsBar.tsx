import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface Stat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { value: 3, label: "Task views" },
  { value: 4, label: "Priority levels" },
  { value: 2, label: "Export formats" },
  { value: 100, suffix: "%", label: "Real-time sync" },
];

function CountUp({ value, decimals = 0, suffix = "" }: Omit<Stat, "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) =>
        setDisplay(
          latest.toLocaleString("en-US", {
            maximumFractionDigits: decimals,
            minimumFractionDigits: decimals,
          })
        ),
    });
    return () => controls.stop();
  }, [inView, value, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="border-y border-slate-200 border-t-0 bg-slate-50/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-semibold tracking-tight text-slate-900">
              <CountUp {...stat} />
            </p>
            <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}