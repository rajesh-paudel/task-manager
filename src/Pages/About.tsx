import {
  BarChart3,
  Check,
  Lock,
  RefreshCw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SITE_URL } from "../utils/constants";
import Reveal from "../components/ui/Reveal";

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
    icon: Lock,
    title: "Private by default",
    description:
      "Your tasks live in your account, hosted on Firebase, and exportable as JSON or CSV anytime. No selling data, no dark patterns.",
  },
];

const storyPoints = [
  "Three views of the same tasks — list, kanban, and calendar",
  "Priorities, due dates, and overdue flags that tell you what's next",
  "Realtime sync, so your list is current wherever you open it",
];

const highlights = [
  {
    icon: Zap,
    title: "Quick to capture",
    description:
      "Add a task with a title, priority, and due date in seconds.",
  },
  {
    icon: RefreshCw,
    title: "Real-time sync",
    description:
      "Live updates across your devices and sessions, always.",
  },
  {
    icon: Lock,
    title: "Your data is yours",
    description:
      "Export tasks as JSON or CSV anytime, and import them back.",
  },
  {
    icon: BarChart3,
    title: "Progress you can see",
    description:
      "Weekly completion, status, and priority charts on your overview.",
  },
];

export default function About() {
  return (
    <main id="main-content" className="bg-white font-sans">
      <Helmet>
        <title>About | TaskPulse</title>
        <meta
          name="description"
          content="Learn about TaskPulse — a focused task management app for organizing your work in list, kanban, and calendar views, with real-time sync."
        />
        <meta
          property="og:title"
          content="About | TaskPulse"
        />
        <meta
          property="og:description"
          content="TaskPulse is a focused task management app for organizing your work in list, kanban, and calendar views, with real-time sync."
        />
        <meta
          property="og:image"
          content={`${SITE_URL}/og-image.png`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:url"
          content={`${SITE_URL}/about`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${SITE_URL}/about`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "About",
                item: `${SITE_URL}/about`,
              },
            ],
          })}
        </script>
      </Helmet>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
            About TaskPulse
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            We got tired of tools that made work harder to see.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-500">
            TaskPulse started as a smaller, quieter alternative to project
            management tools that had grown too complicated to actually use day
            to day. The goal has stayed the same since: make it obvious what
            needs doing, and when.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {["List view", "Kanban board", "Calendar", "Realtime sync"].map(
              (chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600"
                >
                  {chip}
                </span>
              ),
            )}
          </div>
        </Reveal>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
                Our story
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                Built for the way you actually work
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-500">
                Most task tools assume you run a complex organization. We
                assumed the opposite: one person, one list, a handful of
                priorities, and a deadline or two. That's what TaskPulse is
                built around.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-500">
                No projects, no portfolios, no invite flows to configure.
                Create an account, add your first task, and the tool gets out
                of the way.
              </p>
              <ul className="mt-8 space-y-3">
                {storyPoints.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm font-medium text-slate-700"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-600">
                      <Check className="h-3 w-3 text-white" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-2">
              {highlights.map(({ icon: Icon, title, description }, i) => (
                <Reveal key={title} delay={i * 0.1} className="h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
            Values
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
            What we care about
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 0.1} className="h-full">
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Want to say hello?
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              We read every message that comes through the contact page.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}