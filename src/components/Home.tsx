import { Link } from "react-router-dom";
import { Zap, Shield, Layers, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-800">
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-6">
            <Zap className="h-3 w-3 fill-indigo-100" /> Introducing TaskPulse
            Cloud Sync
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-none">
            The minimal workspace for{" "}
            <span className="text-indigo-600">high-performance</span> teams.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Streamline assignments, map high-priority targets, and secure your
            team infrastructure on a lightning-fast cloud foundation.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm shadow-indigo-100 transition-colors"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm/5">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Real-time Updates
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Data synchronizes across all active client instances instantly using
            lightweight JSON WebSocket listeners.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm/5">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Role Isolation
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Strict database validation guards your records. Administrators
            maintain full scope command parameters.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm/5">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
            <Layers className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Minimal Overhead
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Stripped of heavy corporate bloat. Pure, clean asset performance
            designed around scannability.
          </p>
        </div>
      </section>
    </div>
  );
}
