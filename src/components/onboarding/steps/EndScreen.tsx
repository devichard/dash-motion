"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function EndScreen() {
  return (
    <div className="relative w-screen h-screen grid place-items-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl mx-auto px-6"
      >
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <CheckCircle2 className="text-[#74B816]" size={100} />
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold drop-shadow-lg "
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Por aqui está <span className="text-[#74B816]">tudo certo!</span> 🍋
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Sua empresa foi cadastrada e seus documentos estão sob análise. Assim que tudo for validado, você poderá
          acessar o painel e começar a usar a PagLemon.
        </motion.p>
      </motion.div>
    </div>
  );
}
