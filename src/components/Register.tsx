import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { Eye, EyeOff, CheckSquare } from "lucide-react";
import { auth, db } from "../utils/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Please enter a valid email."),
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
type Form = z.infer<typeof formSchema>;

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Form>({ resolver: zodResolver(formSchema), mode: "onTouched" });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const handleRegister = async (data: Form) => {
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;

      await set(ref(db, `users/${user.uid}`), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        profileUrl: "",
        title: "",
        bio: "",
        role: "user",
        createdAt: Date.now(),
      });
      reset();
      navigate("/dashboard");
    } catch (err: any) {
      switch (err.code) {
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 font-sans">
      <Helmet>
        <title>Create Account | TaskPulse</title>
        <meta name="description" content="Create your TaskPulse account." />
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

        <h1 className="text-2xl font-semibold text-slate-900">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Set up your workspace in a few seconds.
        </p>

        {error && (
          <div className="mt-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Rajesh Paudel"
              className="w-full px-0 py-2 border-0 border-b border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 bg-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

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
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
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
    </div>
  );
}
