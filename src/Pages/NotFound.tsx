import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <main
      id="main-content"
      className="bg-white font-sans flex min-h-screen flex-col items-center justify-center px-6 text-center"
    >
      <Helmet>
        <title>404 | TaskPulse</title>
        <meta name="description" content="Page not found." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
        404
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        This page doesn't exist.
      </h1>

      <p className="mt-4 max-w-md text-lg text-slate-500">
        The page you're looking for may have been moved or never existed.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
      >
        Back to home
        <ArrowRight className="h-4 w-4" />
      </Link>
    </main>
  );
}