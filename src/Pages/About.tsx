import { Target, Users, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Target,
    title: "Built for actual work",
    description:
      "Every feature exists because it removes a real point of friction, not because it looked good on a roadmap slide.",
  },
  {
    icon: Sparkles,
    title: "Simple over clever",
    description:
      "We'd rather ship the boring, obvious version of a feature than the impressive one nobody figures out how to use.",
  },
  {
    icon: Users,
    title: "Made with small teams",
    description:
      "TaskPulse is shaped by feedback from the teams actually using it, not by guessing what enterprise buyers want.",
  },
];

export default function About() {
  return (
    <div className="bg-white font-sans">
      <Helmet>
        <title>About | TaskPulse</title>
        <meta
          name="description"
          content="Learn about TaskPulse — a simpler, quieter project management tool built for small teams who need to see what needs doing and who's doing it."
        />
        <meta
          property="og:title"
          content="About | TaskPulse"
        />
        <meta
          property="og:description"
          content="TaskPulse is a simpler project management tool built for small teams who need to see what needs doing and who's doing it."
        />
        <meta
          property="og:image"
          content="https://task-manager-five-omega-36.vercel.app/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:url"
          content="https://task-manager-five-omega-36.vercel.app/about"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href="https://task-manager-five-omega-36.vercel.app/about"
        />
      </Helmet>
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <span className="text-xs font-semibold tracking-wide text-orange-600 uppercase">
          About TaskPulse
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          We got tired of tools that made work harder to see.
        </h1>
        <p className="mt-5 text-base text-slate-500 leading-relaxed max-w-xl mx-auto">
          TaskPulse started as a smaller, quieter alternative to project
          management tools that had grown too complicated to actually use day to
          day. The goal has stayed the same since: make it obvious what needs
          doing, and who's doing it.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight text-center">
          What we care about
        </h2>
        <div className="mt-12 grid sm:grid-cols-3 gap-10">
          {values.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100 text-center">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Want to say hello?
        </h2>
        <p className="mt-3 text-sm text-slate-500">
          We read every message that comes through the contact page.
        </p>
        <Link
          to="/contact"
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
