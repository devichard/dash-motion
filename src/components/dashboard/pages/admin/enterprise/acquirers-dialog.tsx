"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AcquirersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enterpriseName?: string;
  cnpj?: string;
}

const DEFAULT_ACQUIRERS = {
  pix: "default",
  creditCard: "default",
  boleto: "default",
  baas: "default",
};

const ACQUIRER_OPTIONS = {
  pix: [
    { value: "default", label: "Utilizar padrão" },
    { value: "pagmar", label: "Conta PAGMAR" },
    { value: "axisbanking", label: "Conta AXISBANKING" },
    { value: "avivhub", label: "Conta AVIVHUB" },
    { value: "cash_time_pay", label: "Conta CASH_TIME_PAY" },
  ],
  creditCard: [
    { value: "default", label: "Utilizar padrão" },
    { value: "axisbanking", label: "Conta AXISBANKING" },
  ],
  boleto: [{ value: "default", label: "Utilizar padrão" }],
  baas: [
    { value: "default", label: "Utilizar padrão" },
    { value: "axisbanking", label: "Conta AXISBANKING" },
  ],
};

export default function AcquirersDialog({ open, onOpenChange }: AcquirersDialogProps) {
  const [acquirers, setAcquirers] = useState(DEFAULT_ACQUIRERS);

  const handleSelectChange = (key: keyof typeof acquirers, value: string) => {
    setAcquirers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleConfirm = () => {
    console.log("Saving acquirers:", acquirers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adquirentes e Banking da empresa</DialogTitle>
          <DialogDescription>
            Selecione adquirentes customizadas para empresas específicas da plataforma.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="pix">PIX</Label>
            <Select value={acquirers.pix} onValueChange={(value) => handleSelectChange("pix", value)}>
              <SelectTrigger id="pix" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACQUIRER_OPTIONS.pix.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="creditCard">Cartão de crédito</Label>
            <Select value={acquirers.creditCard} onValueChange={(value) => handleSelectChange("creditCard", value)}>
              <SelectTrigger id="creditCard" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACQUIRER_OPTIONS.creditCard.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="boleto">Boleto</Label>
            <Select value={acquirers.boleto} onValueChange={(value) => handleSelectChange("boleto", value)}>
              <SelectTrigger id="boleto" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACQUIRER_OPTIONS.boleto.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="baas">BaaS</Label>
            <Select value={acquirers.baas} onValueChange={(value) => handleSelectChange("baas", value)}>
              <SelectTrigger id="baas" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACQUIRER_OPTIONS.baas.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full" variant="primary" onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
