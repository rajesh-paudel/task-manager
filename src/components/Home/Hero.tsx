import { motion, type Variants } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import dashboardLight from "../../assets/dashboardLight.png";
import dashboardDark from "../../assets/dashboardDark.png";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero() {
  const { theme } = useTheme();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(234,88,12,0.08),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/dashboard/calendar"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/60 px-3.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:bg-slate-900/60"
            >
              <CalendarDays className="h-3.5 w-3.5 text-orange-600" />
              New: Calendar view
              <ArrowRight className="h-3 w-3" />
            </Link>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Task management that{" "}
            <span className="text-orange-600">feels effortless</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-500"
          >
            Plan, track, and ship your work in one focused workspace. Your tasks
            stay in sync across every screen, without the noise.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:w-auto"
            >
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              See pricing
            </Link>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-sm text-slate-400"
          >
            Free to start · No credit card required
          </motion.p>
        </motion.div>
        {/* Product screenshot */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-900/5 shadow-2xl shadow-slate-900/10 dark:shadow-black/40">
            <img
              src={theme === "dark" ? dashboardDark : dashboardLight}
              alt="TaskPulse dashboard"
              className="block h-auto w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
