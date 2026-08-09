import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Phone, ShoppingBag, Loader2, AlertCircle, RefreshCw } from "lucide-react";

type TransitionState = "processing" | "success" | "opening" | "error";

interface WhatsAppOrderTransitionProps {
  onComplete: () => void;
  orderNumber: string;
  isError?: boolean;
  onRetry?: () => void;
}

export function WhatsAppOrderTransition({
  onComplete,
  orderNumber,
  isError = false,
  onRetry,
}: WhatsAppOrderTransitionProps) {
  const [state, setState] = useState<TransitionState>("processing");

  useEffect(() => {
    if (isError) {
      setState("error");
      return;
    }

    const timer1 = setTimeout(() => setState("success"), 2000);
    const timer2 = setTimeout(() => setState("opening"), 3000);
    const timer3 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete, isError]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F] p-6 text-center"
      style={{ perspective: 1000 }}
    >
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[100px]" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <AnimatePresence mode="wait">
          {state === "error" ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              className="flex flex-col items-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-destructive/10 text-destructive shadow-2xl shadow-destructive/20">
                <AlertCircle className="h-12 w-12" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Ops! Ocorreu um erro</h2>
              <p className="mb-8 text-sm text-muted-foreground">
                Não conseguimos abrir o WhatsApp automaticamente para enviar seu pedido.
              </p>
              <button
                onClick={onRetry}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition-transform active:scale-95"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Central 3D Element */}
              <motion.div
                key="element"
                initial={{ 
                  opacity: 0, 
                  scale: 0.75, 
                  y: 40, 
                  rotateX: 45, 
                  rotateY: -10,
                  filter: "blur(10px)"
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0, 
                  rotateX: 0, 
                  rotateY: 0,
                  filter: "blur(0px)"
                }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="relative mb-12"
              >
                <motion.div
                  animate={state === "processing" ? {
                    y: [0, -8, 0],
                    rotateX: [0, 2, 0],
                    rotateY: [0, -3, 0],
                  } : {}}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="flex h-32 w-32 items-center justify-center rounded-3xl bg-card shadow-[0_20px_50px_rgba(0,0,0,0.5)] outline outline-1 outline-white/10 ring-1 ring-primary/20"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex flex-col items-center gap-2" style={{ transform: "translateZ(20px)" }}>
                    <AnimatePresence mode="wait">
                      {state === "processing" ? (
                        <motion.div
                          key="bag"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <ShoppingBag className="h-14 w-14 text-primary" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="check"
                          initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500"
                        >
                          <Check className="h-10 w-10 stroke-[3px]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Inner Glow */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                </motion.div>

                {/* Progress Ring for Processing */}
                {state === "processing" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -inset-4"
                  >
                    <svg className="h-full w-full -rotate-90 transform">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        className="fill-none stroke-primary/10 stroke-1"
                      />
                      <motion.circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        className="fill-none stroke-primary stroke-2"
                        strokeLinecap="round"
                        style={{ pathLength: 1 }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "linear" }}
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>

              {/* Text Information */}
              <div className="h-24">
                <AnimatePresence mode="wait">
                  {state === "processing" && (
                    <motion.div
                      key="proc"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <h2 className="text-xl font-bold tracking-tight">Preparando seu pedido...</h2>
                      </div>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        Aguarde um instante <Loader2 className="h-3 w-3 animate-spin" />
                      </p>
                    </motion.div>
                  )}

                  {state === "success" && (
                    <motion.div
                      key="succ"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col items-center"
                    >
                      <h2 className="mb-1 text-2xl font-bold tracking-tight text-green-500">Pedido confirmado!</h2>
                      <p className="text-sm text-muted-foreground">
                        Seu pedido está pronto para ser enviado.
                      </p>
                    </motion.div>
                  )}

                  {state === "opening" && (
                    <motion.div
                      key="open"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span className="text-xl">📱</span>
                        <h2 className="text-xl font-bold tracking-tight">Abrindo WhatsApp...</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Direcionando para finalizar o envio.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Number Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 rounded-full bg-white/5 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground outline outline-1 outline-white/10"
              >
                Pedido #{orderNumber}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
