import { useState, useRef } from "react";
import { Mail, Clock, CheckCircle2 } from "lucide-react";
import { db } from "../utils/firebaseConfig";
import { ref, push } from "firebase/database";
import { Turnstile } from "@marsidev/react-turnstile";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Helmet } from "react-helmet-async";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const MIN_FILL_TIME = 3000;
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email."),
  subject: z.string().trim().min(2, "Subject is required."),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
  website: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const formLoadedAt = useRef(Date.now());

  const [token, setToken] = useState<string>("");
  const turnstileRef = useRef<any>(null);

  const [error, setError] = useState("");
  const [isSent, setIsSent] = useState(false);

  const onSubmit = async (data: ContactForm) => {
    setError("");
    if (!token) {
      setError("Please verify you're human.");
      return;
    }

    //honeypot field
    if (data.website?.trim()) {
      return;
    }

    //checks if form is filled within 3 sec considering it can be bot
    const elapsed = Date.now() - formLoadedAt.current;

    if (elapsed < MIN_FILL_TIME) {
      setError("Please take a little more time to complete the form.");
      return;
    }

    try {
      const { website, ...contactData } = data;
      await push(ref(db, "/forms"), {
        ...contactData,
        createdAt: Date.now(),
      });
      turnstileRef.current?.reset();
      setToken("");
      reset();
      setIsSent(true);
    } catch (err: any) {
      turnstileRef.current?.reset();
      setToken("");
      setError(err.message || "Couldn't send your message. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <Helmet>
        <title>Contact | TaskPulse</title>
        <meta
          name="description"
          content="Have a question, feedback, or need help with TaskPulse? Reach out — we read every message."
        />
        <meta
          property="og:title"
          content="Contact | TaskPulse"
        />
        <meta
          property="og:description"
          content="Have a question, feedback, or need help with TaskPulse? Reach out — we read every message."
        />
        <meta
          property="og:image"
          content="https://task-manager-five-omega-36.vercel.app/og-image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:url"
          content="https://task-manager-five-omega-36.vercel.app/contact"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TaskPulse" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href="https://task-manager-five-omega-36.vercel.app/contact"
        />
      </Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16">
        <div>
          <span className="text-xs font-semibold tracking-wide text-orange-600 uppercase">
            Get in touch
          </span>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight leading-tight">
            Questions, feedback,
            <br />
            or just say hello.
          </h1>

          <p className="mt-4 text-sm text-slate-500 max-w-sm leading-relaxed">
            Whether something's broken, you need help getting set up, or you
            have an idea for TaskPulse — we read every message.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">Email</p>
                <p className="text-sm text-slate-500">support@taskpulse.io</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Response time
                </p>
                <p className="text-sm text-slate-500">
                  Usually within one business day.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {isSent ? (
            <div className="flex flex-col items-start gap-3 pt-4">
              <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                Message sent
              </h2>

              <p className="text-sm text-slate-500">
                Thanks for reaching out — we'll get back to you soon.
              </p>

              <button
                onClick={() => {
                  formLoadedAt.current = Date.now();
                  setIsSent(false);
                  reset();
                  setToken("");
                  turnstileRef.current?.reset();
                }}
                className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </div>
              )}
              {/* honeypot field */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0,
                    pointerEvents: "none",
                  }}
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    type="text"
                    autoComplete="off"
                    tabIndex={-1}
                    {...register("website")}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Name
                  </label>

                  <input
                    type="text"
                    placeholder="Your name"
                    {...register("name")}
                    className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />

                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="you@company.com"
                    {...register("email")}
                    className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                  />

                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Subject
                </label>

                <input
                  type="text"
                  placeholder="What's this about?"
                  {...register("subject")}
                  className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                />

                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.subject.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Message
                </label>

                <textarea
                  rows={5}
                  placeholder="Tell us what's going on"
                  {...register("message")}
                  className="w-full resize-none border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none"
                />

                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <Turnstile
                ref={turnstileRef}
                siteKey={SITE_KEY}
                onSuccess={(token: string) => setToken(token)}
                onExpire={() => setToken("")}
                onError={() => setToken("")}
              />
              <button
                type="submit"
                disabled={!token || isSubmitting}
                className="mt-2 w-full rounded-lg bg-orange-600 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
