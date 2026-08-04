import { Check } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { SITE_URL } from "../utils/constants";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For getting a small project organized.",
    features: [
      "Up to 3 boards",
      "Unlimited tasks",
      "List & kanban views",
      "Basic reminders",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$8",
    period: "per user / month",
    description: "For individuals who live in their task list.",
    features: [
      "Unlimited boards",
      "Priority & due date views",
      "Calendar sync",
      "Email digests",
      "Priority support",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$14",
    period: "per user / month",
    description: "For teams that need shared visibility.",
    features: [
      "Everything in Pro",
      "Shared team boards",
      "Role-based permissions",
      "Activity history",
      "Admin controls",
    ],
    cta: "Talk to sales",
    highlighted: false,
  },
];


export default function Pricing() {
  return (
    <main id="main-content" className="bg-white font-sans">
      <Helmet>
        <title>Pricing | TaskPulse</title>
        <meta
          name="description"
          content="Simple, transparent pricing for TaskPulse. Start free, upgrade when your team needs it. Plans from $0 to $14 per user per month."
        />
        <meta
          property="og:title"
          content="Pricing | TaskPulse"
        />
        <meta
          property="og:description"
          content="Simple, transparent pricing for TaskPulse. Start free, upgrade when your team needs it."
        />
        <meta
          property="og:image"
          content={`${SITE_URL}/og-image.png`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:url"
          content={`${SITE_URL}/pricing`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${SITE_URL}/pricing`}
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
                name: "Pricing",
                item: `${SITE_URL}/pricing`,
              },
            ],
          })}
        </script>
      </Helmet>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
            Pricing
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Simple pricing, no surprises
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            Start free. Upgrade only when your team actually needs to.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-2xl border p-8 ${
                tier.highlighted
                  ? "border-2 border-orange-600"
                  : "border border-slate-200"
              }`}
            >
              {tier.highlighted && (
                <span className="mb-4 self-start rounded-full bg-orange-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-sm font-semibold text-slate-900">
                {tier.name}
              </h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-slate-900">
                  {tier.price}
                </span>
                <span className="text-xs text-slate-400">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{tier.description}</p>

              <ul className="mt-6 flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`mt-7 rounded-md py-2.5 text-center text-sm font-semibold transition ${
                  tier.highlighted
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
