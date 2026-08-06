import React, { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SuccessToastProps {
  title: string;
  description: string;
  duration?: number;
  onClose?: () => void;
}

export function SuccessToast({
  title,
  description,
  duration = 4000,
  onClose,
}: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  return (
    <AnimatePresence onExitComplete={onClose ? () => onClose() : undefined}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="pointer-events-auto relative flex w-full max-w-[320px] overflow-hidden rounded-xl border border-primary/40 bg-[#171717] p-4 shadow-2xl sm:max-w-[350px]"
        >
          {/* Wave Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
              className="absolute -left-1/4 bottom-0 w-[150%] h-full opacity-20"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M0,100 C30,80 70,80 100,100 Z"
                fill="currentColor"
                className="text-primary"
                animate={{
                  d: [
                    "M0,100 C30,80 70,80 100,100 Z",
                    "M0,100 C30,90 70,70 100,100 Z",
                    "M0,100 C30,80 70,80 100,100 Z",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div>

          <div className="relative z-10 flex w-full items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>

            <div className="flex-1 pt-0.5">
              <h3 className="text-sm font-black text-white">{title}</h3>
              <p className="mt-1 text-xs text-zinc-400">{description}</p>
            </div>

            <button
              onClick={handleClose}
              className="ml-2 rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
