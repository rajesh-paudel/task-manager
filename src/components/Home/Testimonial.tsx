import { Star } from "lucide-react";
import Reveal from "../ui/Reveal";

const testimonials = [
  {
    quote:
      "I stopped losing tasks across notes and chats. That alone paid for itself in the first week.",
    name: "Mandeep Chaudhary",
    role: "Ops consultant",
    initials: "MC",
  },
  {
    quote:
      "The realtime sync means my list is always up to date, whether I'm on my laptop or phone. I run my whole week off it now.",
    name: "Sarita Rai",
    role: "Product designer",
    initials: "SR",
  },
  {
    quote:
      "I tried three other tools and always ended up back in a spreadsheet. TaskPulse was the first one that stuck.",
    name: "Bibek Shrestha",
    role: "Freelance developer",
    initials: "BS",
  },
];

export default function Testimonial() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
          Testimonials
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Loved by teams
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {testimonials.map(({ quote, name, role, initials }, i) => (
          <Reveal key={name} delay={i * 0.1} className="h-full">
            <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-slate-600">
                "{quote}"
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">{role}</p>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}