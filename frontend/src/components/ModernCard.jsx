import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export function ModernCard({ children, className, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      className={cn(
        "bg-white rounded-3xl p-6 shadow-soft border border-surface-200",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
