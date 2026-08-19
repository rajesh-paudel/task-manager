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
  success: "text-orange-400",
  error: "text-white",
  info: "text-orange-300",
};

const bgColors: Record<ToastType, string> = {
  success: "bg-slate-900",
  error: "bg-red-600",
  info: "bg-slate-700",
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
                  className={`pointer-events-auto flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm text-white shadow-lift ${bgColors[t.type]}`}
                >
                  <Icon className={`h-4.5 w-4.5 mt-0.5 shrink-0 ${iconColors[t.type]}`} />
                  <p className="flex-1 leading-snug">{t.message}</p>
                  <button
                    onClick={() => dismiss(t.id)}
                    className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
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
