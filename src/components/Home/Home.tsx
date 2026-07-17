import { Helmet } from "react-helmet-async";
import Hero from "./Hero";
import StatsBar from "./StatsBar";
import Comparison from "./Comparision";
import Integrations from "./Integrations";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import Testimonial from "./Testimonial";
import FAQ from "./Faq";
import CTABanner from "./Ctabanner";

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
