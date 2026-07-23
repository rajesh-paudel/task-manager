import { Check } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

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

const SITE_URL = "https://task-manager-five-omega-36.vercel.app";

export default function Pricing() {
  return (
    <main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
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
          content="https://task-manager-five-omega-36.vercel.app/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:url"
          content="https://task-manager-five-omega-36.vercel.app/pricing"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href="https://task-manager-five-omega-36.vercel.app/pricing"
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
      <div className="max-w-lg mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
          Simple pricing, no surprises
        </h1>
        <p className="mt-3 text-sm text-slate-500 leading-relaxed">
          Start free. Upgrade only when your team actually needs to.
        </p>
      </div>

      <div className="mt-12 grid sm:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-2xl p-6 flex flex-col ${
              tier.highlighted
                ? "border-2 border-orange-600 bg-white"
                : "border border-slate-200 bg-white"
            }`}
          >
            {tier.highlighted && (
              <span className="self-start mb-3 text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                Most popular
              </span>
            )}
            <h3 className="text-sm font-semibold text-slate-900">
              {tier.name}
            </h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-slate-900 tracking-tight">
                {tier.price}
              </span>
              <span className="text-xs text-slate-400">{tier.period}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">{tier.description}</p>

            <ul className="mt-6 space-y-2.5 flex-1">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <Check className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Link
              to="/register"
              className={`mt-7 text-center py-2.5 rounded-lg text-sm font-medium ${
                tier.highlighted
                  ? "text-white bg-orange-600 hover:bg-orange-700"
                  : "text-slate-900 bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
