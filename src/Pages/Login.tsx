import { useState } from "react";
import { auth } from "../utils/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { CheckSquare, Eye, EyeOff } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
      await signInWithEmailAndPassword(auth, data.email, data.password);
      reset();
      navigate("/dashboard");
    } catch (err: any) {
      console.log(err.message);
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 font-sans">
      <Helmet>
        <title>Login | TaskPulse</title>
        <meta
          name="description"
          content="Sign in to your TaskPulse account to manage tasks, track projects, and stay organized."
        />
        <meta
          property="og:title"
          content="Login | TaskPulse"
        />
        <meta
          property="og:description"
          content="Sign in to your TaskPulse account to manage tasks, track projects, and stay organized."
        />
        <meta
          property="og:image"
          content="https://task-manager-five-omega-36.vercel.app/og-image.png"
        />
        <meta property="og:image:width" content="1727" />
        <meta property="og:image:height" content="911" />
        <meta
          property="og:url"
          content="https://task-manager-five-omega-36.vercel.app/login"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href="https://task-manager-five-omega-36.vercel.app/login"
        />
      </Helmet>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
            <CheckSquare className="h-4 w-4" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            TaskPulse
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to continue to your workspace.
        </p>

        {error && (
          <div className="mt-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleLogin)} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@company.com"
              className="w-full px-0 py-2 border-0 border-b border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 bg-transparent"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className="w-full px-0 py-2 pr-8 border-0 border-b border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 bg-transparent"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
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
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50 mt-2"
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
    </div>
  );
}
