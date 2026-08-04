import { Star, Quote } from "lucide-react";
import Reveal from "../ui/Reveal";

const testimonials = [
  {
    quote:
      "We stopped losing track of who owned what. That alone paid for itself in the first week.",
    name: "Mandeep Chaudhary",
    role: "Ops Lead, Loop Studio",
    initials: "MC",
    color: "bg-gradient-to-br from-orange-500 to-amber-500",
  },
  {
    quote:
      "The realtime sync means my team and I are always looking at the same board. We run our entire sprint off it now.",
    name: "Sarita Rai",
    role: "Engineering Manager, Northwind",
    initials: "SR",
    color: "bg-gradient-to-br from-indigo-500 to-violet-500",
  },
  {
    quote:
      "I tried three other tools and always ended up back in a spreadsheet. TaskPulse was the first one that stuck.",
    name: "Bibek Shrestha",
    role: "Founder, Craftly",
    initials: "BS",
    color: "bg-gradient-to-br from-emerald-500 to-teal-500",
  },
];

export default function Testimonial() {
  return (
    <section className="border-t border-slate-200 bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-600">Loved by teams</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Don't take our word for it
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map(({ quote, name, role, initials, color }, i) => (
            <Reveal key={name} delay={i * 0.1}>
              <figure className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/30">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-orange-100 dark:text-orange-500/20" aria-hidden="true" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-slate-700">
                  "{quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${color}`}>
                    {initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}