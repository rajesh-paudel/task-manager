import { Helmet } from "react-helmet-async";

import Hero from "../components/Home/Hero";
import StatsBar from "../components/Home/StatsBar";
import Comparison from "../components/Home/Comparision";
import Integrations from "../components/Home/Integrations";
import HowItWorks from "../components/Home/HowItWorks";
import Features from "../components/Home/Features";
import Testimonial from "../components/Home/Testimonial";
import FAQ, { faqs } from "../components/Home/Faq";
import CTABanner from "../components/Home/Ctabanner";

export default function Home() {
  return (
    <main id="main-content" className="bg-white font-sans">
      <Helmet>
        <title>TaskPulse | Organize Tasks, Projects & Team Work</title>
        <meta
          name="description"
          content="TaskPulse is a modern task management platform to organize projects, track progress, and boost productivity."
        />
        <meta
          property="og:title"
          content="TaskPulse | Organize Tasks, Projects & Team Work"
        />

        <meta
          property="og:description"
          content="TaskPulse is a modern task management platform to organize projects, track progress, and boost productivity."
        />

        <meta
          property="og:image"
          content="https://task-manager-five-omega-36.vercel.app/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        <meta
          property="og:url"
          content="https://task-manager-five-omega-36.vercel.app/"
        />

        <meta property="og:type" content="website" />

        <meta property="og:site_name" content="TaskPulse" />

        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href="https://task-manager-five-omega-36.vercel.app/"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "TaskPulse",
            url: "https://task-manager-five-omega-36.vercel.app/",
            logo: "https://task-manager-five-omega-36.vercel.app/og-image.png",
            description:
              "TaskPulse is a modern task management platform to organize projects, track progress, and boost productivity.",
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "TaskPulse",
            url: "https://task-manager-five-omega-36.vercel.app/",
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
            url: "https://task-manager-five-omega-36.vercel.app/",
            applicationCategory: "ProjectManagement",
            operatingSystem: "Web",
            description:
              "TaskPulse is a modern task management platform to organize projects, track progress, and boost productivity.",
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
      <Integrations />
      <HowItWorks />

      <Testimonial />
      <FAQ />
      <CTABanner />
    </main>
  );
}
