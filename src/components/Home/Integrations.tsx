import {
  CalendarDays,
  Paperclip,
  MessageSquare,
  Clock,
  Mail,
  Webhook,
} from "lucide-react";
import Reveal from "../ui/Reveal";

const integrations = [
  { icon: CalendarDays, label: "Calendar sync" },
  { icon: Paperclip, label: "File attachments" },
  { icon: MessageSquare, label: "Chat alerts" },
  { icon: Clock, label: "Time tracking" },
  { icon: Mail, label: "Email digests" },
  { icon: Webhook, label: "API & webhooks" },
];

export default function Integrations() {
  return (
    <section className="border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-600">Integrations</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Fits into how you already work
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            TaskPulse connects to the tools your team already uses, so nothing has to move to a new home.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {integrations.map(({ icon: Icon, label }, i) => (
            <Reveal key={label} delay={i * 0.07}>
              <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
