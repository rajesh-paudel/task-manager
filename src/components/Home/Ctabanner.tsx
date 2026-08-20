import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";

export default function CTABanner() {
  return (
    <section className="border-t border-slate-200 bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
            Get started
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Your next sprint starts here.
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Free to start. No credit card required.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:w-auto"
            >
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex w-full items-center justify-center rounded-md border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white sm:w-auto"
            >
              Compare plans
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
