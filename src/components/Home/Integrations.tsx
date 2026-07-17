import {
  CalendarDays,
  Paperclip,
  MessageSquare,
  Clock,
  Mail,
  Webhook,
} from "lucide-react";

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
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-100">
      <div className="max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Fits into how you already work
        </h2>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          TaskPulse connects to the tools your team already uses, so nothing has
          to move to a new home.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {integrations.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3.5 border border-slate-200 rounded-xl"
          >
            <div className="h-8 w-8 shrink-0 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
