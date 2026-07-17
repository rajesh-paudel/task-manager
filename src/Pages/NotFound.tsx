import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>

      <p className="mt-4 text-gray-600">
        The page you're looking for doesn't exist.
      </p>

      <Link to="/" className="mt-6 rounded bg-blue-600 px-4 py-2 text-white">
        Go Home
      </Link>
    </div>
  );
}
