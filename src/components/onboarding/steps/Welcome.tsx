"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Lemon1 from "../../../../public/img/limaozin.png";

export default function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative w-screen h-screen grid place-items-center overflow-hidden ">
      <motion.div
        className="absolute top-5 left-3"
        animate={{ y: [0, 45, 0], rotate: [90, 120, 180, 90] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={Lemon1} alt="Lemon" width={120} height={120} className="opacity-80" />
      </motion.div>

      <motion.div
        className="absolute bottom-15 right-2"
        animate={{ y: [0, -25, 0], rotate: [50, 90, 40, 50] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={Lemon1} alt="Lemon" width={110} height={110} className="opacity-80" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 lg:left-100 left-20 -translate-x-1/2"
        animate={{ y: [0, -15, 0], rotate: [180, 170, 150, 180] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={Lemon1} alt="Lemon" width={90} height={90} className="opacity-60" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-2xl mx-auto px-6"
      >
        <motion.h1
          className="text-5xl sm:text-6xl font-extrabold drop-shadow-lg"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Bem-vindo à <span className="text-[#74B816]">PagLemon</span> 🍋
        </motion.h1>

        <motion.p
          className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          A experiência de pagamento mais leve e refrescante que você já viu. Vamos configurar tudo rapidinho para você
          começar.
        </motion.p>

        <motion.div className="mt-10 flex justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="lg"
            onClick={onNext}
            className="bg-[#82C91E] hover:bg-[#74B816] text-white text-lg px-10 py-7 rounded-xl shadow-xl"
          >
            Começar agora
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
