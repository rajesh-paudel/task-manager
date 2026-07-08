import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTABanner() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="bg-orange-600 rounded-2xl px-8 py-14 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Your team's next sprint starts here.
        </h2>
        <p className="mt-3 text-sm text-orange-100">
          Free for teams up to 10. No credit card required.
        </p>
        <Link
          to="/register"
          className="mt-7 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-orange-600 bg-white hover:bg-orange-50"
        >
          Get started free
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
