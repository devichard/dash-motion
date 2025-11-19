"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Intro({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  return (
    <div className="relative w-screen h-screen grid place-items-center overflow-hidden text-center px-4">
      <div className="max-w-md space-y-10">
        <motion.h1
          className="text-4xl sm:text-4xl font-extrabold  drop-shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Precisamos de alguns dados para te conhecer melhor
        </motion.h1>
        <p className="text-muted-foreground text-lg">
          Essas informações são importantes para configurar seu perfil e validar sua conta corretamente. É rápido e
          fácil - <strong> Como fazer uma limonada!🍋‍🟩</strong>
        </p>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Button type="button" variant="outline" className="flex-1" onClick={onPrev}>
            Voltar
          </Button>
          <Button onClick={onNext} type="submit" variant="primary" className="flex-1 bg-[#74B816] hover:bg-[#66A80F]">
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
