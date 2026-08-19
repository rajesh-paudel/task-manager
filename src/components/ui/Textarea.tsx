import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export default function Textarea({ invalid = false, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors resize-none ${
        invalid
          ? "border-red-500 focus:border-red-500"
          : "border-slate-200 focus:border-primary-500"
      } ${className ?? ""}`}
      {...props}
    />
  );
}
