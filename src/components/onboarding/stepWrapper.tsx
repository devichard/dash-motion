"use client";

import { AnimatePresence, motion } from "framer-motion";

export function StepWrapper({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
