import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SITE_URL } from "../utils/constants";

const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().trim(),
});

type LoginForm = z.infer<typeof loginSchema>;
export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (data: LoginForm) => {
    setError("");
    try {
      await login(data.email, data.password);
      reset();
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <main
      id="main-content"
      className="bg-white font-sans flex min-h-screen flex-col items-center justify-center px-6"
    >
      <Helmet>
        <title>Login | TaskPulse</title>
        <meta
          name="description"
          content="Sign in to your TaskPulse account to manage tasks, track projects, and stay organized."
        />
        <meta property="og:title" content="Login | TaskPulse" />
        <meta
          property="og:description"
          content="Sign in to your TaskPulse account to manage tasks, track projects, and stay organized."
        />
        <meta
          property="og:image"
          content={`${SITE_URL}/og-image.png`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:url"
          content={`${SITE_URL}/login`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${SITE_URL}/login`}
        />
      </Helmet>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white">
            <CheckSquare className="h-4 w-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            TaskPulse
          </span>
        </div>

        <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Sign in to your workspace
        </h1>

        {error && (
          <div className="mt-6 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleLogin)} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@company.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-orange-600 focus:outline-none"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-orange-600 focus:outline-none"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-md bg-orange-600 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="font-medium text-slate-900 hover:text-orange-600"
          >
            Sign up
          </button>
        </p>
      </div>
    </main>
  );
}
