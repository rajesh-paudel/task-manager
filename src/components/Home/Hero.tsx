import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flag,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const avatarColors = ["bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-sky-500"];

const demoTasks = [
  { title: "Design onboarding flow", tag: "Design", tagClass: "bg-indigo-500", progress: 85 },
  { title: "Ship billing integration", tag: "Dev", tagClass: "bg-emerald-500", progress: 60 },
  { title: "Prepare Q3 roadmap", tag: "Product", tagClass: "bg-amber-500", progress: 35 },
];

export default function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(249,115,22,0.14),transparent_70%)]" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="absolute top-20 -right-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid items-center gap-14 lg:grid-cols-2"
        >
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div variants={itemVariants}>
              <Link
                to="/dashboard/calendar"
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300 dark:hover:bg-orange-500/20"
              >
                <Sparkles className="h-3.5 w-3.5" />
                New: Calendar view
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Task management that{" "}
              <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 bg-clip-text text-transparent">
                keeps your team
              </span>{" "}
              in flow
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0"
            >
              Plan sprints, track progress in real time, and ship faster. TaskPulse
              brings your tasks, calendar, and team into one beautiful workspace —
              synced live with Firebase.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link
                to="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:shadow-xl hover:shadow-orange-500/40 hover:brightness-110 sm:w-auto"
              >
                Start for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white/60 px-7 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-slate-400 hover:bg-white dark:border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20 sm:w-auto"
              >
                See pricing
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
            >
              <div className="flex -space-x-2.5">
                {avatarColors.map((color, i) => (
                  <div
                    key={color}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white ${color}`}
                  >
                    {["AK", "MR", "JT", "SP", "LN"][i]}
                  </div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center gap-0.5 sm:justify-start">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5 text-sm font-semibold text-slate-700">4.9/5</span>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">Trusted by 2,400+ teams</p>
              </div>
            </motion.div>
          </div>

          {/* Product mockup */}
          <motion.div
            variants={itemVariants}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-orange-500/20 via-transparent to-indigo-500/20 blur-2xl" aria-hidden="true" />

            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-200 dark:shadow-black/40">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1 text-xs text-slate-400 ring-1 ring-slate-200">
                  taskpulse.app/dashboard
                </div>
              </div>

              {/* Mockup body */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Good morning, Rajesh</p>
                    <p className="text-lg font-bold text-slate-900">Tuesday, Aug 4</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white">
                    RP
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { label: "In progress", value: "12", accent: "text-orange-600" },
                    { label: "Due today", value: "4", accent: "text-indigo-600" },
                    { label: "Completed", value: "89", accent: "text-emerald-600" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                      <p className={`text-xl font-extrabold ${stat.accent}`}>{stat.value}</p>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3">
                  {demoTasks.map((task) => (
                    <div key={task.title} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <CheckCircle2 className="h-4.5 w-4.5 text-slate-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-800">{task.title}</p>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${task.tagClass}`}>
                            {task.tag}
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${task.progress}%` }}
                            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{task.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating card: due soon */}
            <motion.div
              className="absolute -left-6 -bottom-8 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 dark:shadow-black/40 sm:flex"
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Due in 2 hours</p>
                <p className="text-sm font-bold text-slate-900">Review Q3 roadmap</p>
              </div>
            </motion.div>

            {/* Floating card: upcoming event */}
            <motion.div
              className="absolute -right-4 -top-8 hidden items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 dark:shadow-black/40 sm:flex"
              animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100">
                <CalendarDays className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Tomorrow, 10:00 AM</p>
                <p className="text-sm font-bold text-slate-900">Sprint planning</p>
              </div>
            </motion.div>

            {/* Floating flag chip */}
            <motion.div
              className="absolute -top-6 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-lg shadow-emerald-500/10 lg:flex"
              animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            >
              <Flag className="h-3.5 w-3.5" />
              Sprint 24 shipped
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
