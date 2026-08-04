import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { Eye, EyeOff, CheckSquare } from "lucide-react";
import { auth } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SITE_URL } from "../utils/constants";
import { createUserProfile } from "../api/users";
import { useAppDispatch } from "../store/store";
import { setProfile } from "../store/authSlice";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/\d/, "Password must contain at least one number.")
    .regex(
      /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;]/,
      "Password must contain at least one special character.",
    ),
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleRegister = async (data: RegisterForm) => {
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;

      const profile = await createUserProfile(user.uid, data.name, data.email);
      dispatch(setProfile(profile));
      reset();
      navigate("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      switch (code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists.");
          break;

        case "auth/invalid-email":
          setError("Invalid email address.");
          break;

        case "auth/weak-password":
          setError("Password is too weak.");
          break;

        default:
          setError("Registration failed.");
      }
    }
  };

  return (
    <main id="main-content" className="bg-white font-sans flex min-h-screen flex-col items-center justify-center px-6">
      <Helmet>
        <title>Create Account | TaskPulse</title>
        <meta
          name="description"
          content="Create your TaskPulse account and start organizing tasks, projects, and team work in minutes."
        />
        <meta
          property="og:title"
          content="Create Account | TaskPulse"
        />
        <meta
          property="og:description"
          content="Create your TaskPulse account and start organizing tasks, projects, and team work in minutes."
        />
        <meta
          property="og:image"
          content={`${SITE_URL}/og-image.png`}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:url"
          content={`${SITE_URL}/register`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${SITE_URL}/register`}
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
          Get started
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Set up your workspace in a few seconds.
        </p>

        {error && (
          <div className="mt-6 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Rajesh Paudel"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-orange-600 focus:outline-none"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Password
            </label>
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-medium text-slate-900 hover:text-orange-600"
          >
            Sign in
          </button>
        </p>
      </div>
    </main>
  );
}
