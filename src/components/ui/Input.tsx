import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export default function Input({ invalid = false, className, ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${
        invalid
          ? "border-red-500 focus:border-red-500"
          : "border-slate-200 focus:border-primary-500"
      } ${className ?? ""}`}
      {...props}
    />
  );
}
