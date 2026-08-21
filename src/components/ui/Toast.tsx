import { useCallback, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import {
  ToastContext,
  type ToastType,
} from "../../context/useToast";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

const icons: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const iconColors: Record<ToastType, string> = {
  success: "text-orange-600 dark:text-orange-300",
  error: "text-red-600 dark:text-red-300",
  info: "text-blue-600 dark:text-blue-300",
};

const toastStyles: Record<ToastType, string> = {
  success:
    "border-orange-200 bg-white text-slate-900 dark:border-orange-500/30 dark:bg-[#0f172a] dark:text-white",
  error:
    "border-red-200 bg-white text-slate-900 dark:border-red-500/30 dark:bg-[#0f172a] dark:text-white",
  info:
    "border-blue-200 bg-white text-slate-900 dark:border-blue-500/30 dark:bg-[#0f172a] dark:text-white",
};

const accentStyles: Record<ToastType, string> = {
  success: "bg-orange-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-[70] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 pointer-events-none">
          <AnimatePresence>
            {toasts.map((t) => {
              const Icon = icons[t.type];
              return (
                <motion.div
                  key={t.id}
                  role="status"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className={`pointer-events-auto relative flex items-start gap-2.5 overflow-hidden rounded-lg border px-4 py-3 text-sm shadow-lift ${toastStyles[t.type]}`}
                >
                  <span
                    className={`absolute inset-y-0 left-0 w-1 ${accentStyles[t.type]}`}
                    aria-hidden="true"
                  />
                  <Icon className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${iconColors[t.type]}`} />
                  <p className="flex-1 leading-snug">{t.message}</p>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="shrink-0 text-slate-400 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white transition-colors"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
