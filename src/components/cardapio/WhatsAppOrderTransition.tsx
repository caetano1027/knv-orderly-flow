import { motion } from "motion/react";
import { Check } from "lucide-react";

export function WhatsAppOrderTransition() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center space-y-4 py-8 text-center"
      style={{ willChange: "opacity, transform" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.1 
        }}
        className="gradiente-fogo flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
      >
        <Check className="h-10 w-10 text-primary-foreground" />
      </motion.div>
      
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <h3 className="text-lg font-black uppercase tracking-wide">
          Pedido Processado
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Abrindo o WhatsApp para finalizar...
        </p>
      </motion.div>
    </motion.div>
  );
}
