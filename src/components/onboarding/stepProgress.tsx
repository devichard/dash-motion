"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;
  const stepLabel =
    ["Boas-vindas", "Boas-vindas", "Cadastro", "Cadastro", "Cadastro", "Cadastro", "Cadastro", "Concluído"][
      currentStep - 1
    ] ?? "";

  const { logout } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logout realizado com sucesso!");
    router.push("/auth/signin");
  };

  return (
    <>
      <div className="w-full bg-background/60 backdrop-blur-md border-b py-4">
        <div className="max-w-3xl mx-auto px-6 ">
          <div className="flex justify-between text-sm mb-2 text-muted-foreground">
            <span>{stepLabel}</span>
            <span>
              {currentStep} / {totalSteps}
            </span>
            <div className="flex justify-end cursor-pointer">
              <button
                type="button"
                onClick={() => setShowLogoutModal(true)}
                className="cursor-pointer border-none text-destructive hover:underline"
              >
                Sair da conta
              </button>
            </div>
          </div>
          <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tem certeza que deseja sair?</DialogTitle>
            <DialogDescription>Você pode perder o progresso do cadastro.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowLogoutModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutModal(false);
                handleLogout();
              }}
            >
              Sair
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
