import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";

const ctaPoints = ["Free up to 10 teammates", "No credit card required", "Set up in under a minute"];

export default function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 px-8 py-16 text-center shadow-2xl shadow-orange-600/30 sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_50%_-20%,rgba(255,255,255,0.25),transparent_70%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px]" aria-hidden="true" />

          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your team's next sprint starts here.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-orange-100">
              Join thousands of teams planning, tracking, and shipping with TaskPulse.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {ctaPoints.map((point) => (
                <span key={point} className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-50">
                  <CheckCircle2 className="h-4 w-4" />
                  {point}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-orange-600 shadow-lg shadow-orange-900/20 transition hover:bg-orange-50 dark:bg-white! sm:w-auto"
              >
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
              >
                Compare plans
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}