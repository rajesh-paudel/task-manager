import {
  Download,
  Keyboard,
  Moon,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import Reveal from "../ui/Reveal";

const integrations = [
  { icon: RefreshCw, label: "Real-time sync" },
  { icon: Search, label: "Search & filters" },
  { icon: Moon, label: "Dark mode" },
  { icon: Download, label: "Export & import" },
  { icon: ShieldCheck, label: "Secure sign-in" },
  { icon: Keyboard, label: "Keyboard shortcuts" },
];

export default function Integrations() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
          Everything included
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          No add-ons, no setup
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          Everything works out of the box — no third-party apps or accounts to
          configure.
        </p>
      </Reveal>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3">
        {integrations.map(({ icon: Icon, label }, i) => (
          <Reveal key={label} delay={i * 0.05}>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-slate-300">
              <Icon className="h-5 w-5 shrink-0 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}