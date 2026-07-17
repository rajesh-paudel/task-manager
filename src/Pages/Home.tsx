import { Helmet } from "react-helmet-async";

import Hero from "../components/Home/Hero";
import StatsBar from "../components/Home/StatsBar";
import Comparison from "../components/Home/Comparision";
import Integrations from "../components/Home/Integrations";
import HowItWorks from "../components/Home/HowItWorks";
import Features from "../components/Home/Features";
import Testimonial from "../components/Home/Testimonial";
import FAQ from "../components/Home/Faq";
import CTABanner from "../components/Home/Ctabanner";

export default function Home() {
  return (
    <div className="bg-white font-sans">
      <Helmet>
        <title>TaskPulse | Organize Tasks, Projects & Team Work</title>
        <meta
          name="description"
          content="TaskPulse is a modern task management platform to organize projects, track progress, and boost productivity."
        />
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
    </div>
  );
}
