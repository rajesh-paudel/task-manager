import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface Stat {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { value: 2400, suffix: "+", label: "Teams onboarded" },
  { value: 1.8, decimals: 1, suffix: "M", label: "Tasks completed" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Uptime guaranteed" },
  { value: 4.8, decimals: 1, suffix: "/5", label: "Average rating" },
];

function CountUp({ value, decimals = 0, suffix = "" }: Omit<Stat, "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = value * eased;
      setDisplay(
        current.toLocaleString("en-US", {
          maximumFractionDigits: decimals,
          minimumFractionDigits: decimals,
        })
      );
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
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
    <section className="border-y border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
                <CountUp {...stat} />
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
