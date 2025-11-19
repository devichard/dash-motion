"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function DocumentsIntro({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative w-screen h-screen grid place-items-center overflow-hidden text-center px-4">
      <div className="max-w-md space-y-10">
        <motion.h1
          className="text-4xl sm:text-4xl font-extrabold  drop-shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Perfeito!
        </motion.h1>
        <p className="text-muted-foreground text-lg">
          Agora precisamos de alguns documentos para validar seu cadastro. <strong>Falta pouco!</strong>
        </p>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button onClick={onNext} type="submit" variant="primary" className="flex-1 bg-[#74B816] hover:bg-[#66A80F]">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
