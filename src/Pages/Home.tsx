import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../utils/constants";

import Hero from "../components/Home/Hero";
import StatsBar from "../components/Home/StatsBar";
import Comparison from "../components/Home/Comparision";
import Integrations from "../components/Home/Integrations";
import HowItWorks from "../components/Home/HowItWorks";
import Features from "../components/Home/Features";
import ProductTour from "../components/Home/ProductTour";
import Testimonial from "../components/Home/Testimonial";
import FAQ from "../components/Home/Faq";
import { faqs } from "../utils/faqs";
import CTABanner from "../components/Home/Ctabanner";

export default function Home() {
  return (
    <main id="main-content" className="bg-white font-sans">
      <Helmet>
        <title>TaskPulse | Organize Tasks in List, Kanban & Calendar</title>
        <meta
          name="description"
          content="TaskPulse is a task management app for organizing your to-dos in list, kanban, and calendar views — with priorities, due dates, and real-time sync."
        />
        <meta
          property="og:title"
          content="TaskPulse | Organize Tasks in List, Kanban & Calendar"
        />

        <meta
          property="og:description"
          content="TaskPulse is a task management app for organizing your to-dos in list, kanban, and calendar views — with priorities, due dates, and real-time sync."
        />

        <meta
          property="og:image"
          content={`${SITE_URL}/og-image.png`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        <meta
          property="og:url"
          content={`${SITE_URL}/`}
        />

        <meta property="og:type" content="website" />

        <meta property="og:site_name" content="TaskPulse" />

        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${SITE_URL}/`}
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TaskPulse",
            url: `${SITE_URL}/`,
            logo: `${SITE_URL}/og-image.png`,
            description:
              "TaskPulse is a task management app for organizing to-dos in list, kanban, and calendar views with priorities, due dates, and real-time sync.",
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "TaskPulse",
            url: `${SITE_URL}/`,
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage", 
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "TaskPulse",
            url: `${SITE_URL}/`,
            applicationCategory: "ProjectManagement",
            operatingSystem: "Web",
            description:
              "TaskPulse is a task management app for organizing to-dos in list, kanban, and calendar views with priorities, due dates, and real-time sync.",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free plan available, paid plans from $8/user/month",
            },
          })}
        </script>
      </Helmet>

      <Hero />
      <StatsBar />

      <Comparison />
      <Features />
      <ProductTour />
      <Integrations />
      <HowItWorks />

      <Testimonial />
      <FAQ />
      <CTABanner />
    </main>
  );
}
