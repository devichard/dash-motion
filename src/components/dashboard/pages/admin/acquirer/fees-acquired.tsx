"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

interface FeesAcquiredProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  acquirer?: string;
}

const DEFAULT_FEES = {
  name: "",
  pixFixed: "1.50",
  pixVariable: "0.99",
  boletoFixed: "2.00",
  boletoVariable: "1.99",
  cardFixed: "0.50",
  card1x: "2.99",
  card2x: "3.49",
  card3x: "3.99",
  card4x: "4.49",
  card5x: "4.99",
  card6x: "5.49",
  card7x: "5.99",
  card8x: "6.49",
  card9x: "6.99",
  card10x: "7.49",
  card11x: "7.99",
  card12x: "8.49",
};

export default function FeesAcquired({ open, onOpenChange, acquirer }: FeesAcquiredProps) {
  const [fees, setFees] = useState(DEFAULT_FEES);
  const [retryCard, setRetryCard] = useState(false);
  const [retryPix, setRetryPix] = useState(false);

  useEffect(() => {
    if (open && acquirer) {
      setFees((prev) => ({ ...prev, name: acquirer }));
    }
  }, [open, acquirer]);

  const formatCurrencyInput = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = Number(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentInput = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = Number(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCurrencyChange = (key: keyof typeof fees, value: string) => {
    setFees((prev) => ({
      ...prev,
      [key]: formatCurrencyInput(value),
    }));
  };

  const handlePercentChange = (key: keyof typeof fees, value: string) => {
    setFees((prev) => ({
      ...prev,
      [key]: formatPercentInput(value),
    }));
  };

  const handleReset = () => {
    setFees(DEFAULT_FEES);
    setRetryCard(false);
    setRetryPix(false);
  };

  const handleConfirm = () => {
    console.log("Saving fees:", fees);
    console.log("Retry card:", retryCard);
    console.log("Retry pix:", retryPix);
    onOpenChange(false);
  };

  type FeeField = {
    label: string;
    key: keyof typeof fees;
    prefix?: string;
    suffix?: string;
    onChange?: (key: keyof typeof fees, value: string) => void;
    colSpan: number;
  };

  const handleTextChange = (key: keyof typeof fees, value: string) => {
    setFees((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const feeFields: FeeField[] = [
    {
      label: "Nome (Opcional)",
      key: "name" as const,
      onChange: handleTextChange,
      colSpan: 2,
    },
  ];

  const paymentFields: FeeField[] = [
    {
      label: "Pix (Taxa fixa)",
      key: "pixFixed" as const,
      prefix: "R$",
      onChange: handleCurrencyChange,
      colSpan: 1,
    },
    {
      label: "Pix (Taxa variável)",
      key: "pixVariable" as const,
      suffix: "%",
      onChange: handlePercentChange,
      colSpan: 1,
    },
    {
      label: "Boleto (Taxa fixa)",
      key: "boletoFixed" as const,
      prefix: "R$",
      onChange: handleCurrencyChange,
      colSpan: 1,
    },
    {
      label: "Boleto (Taxa variável)",
      key: "boletoVariable" as const,
      suffix: "%",
      onChange: handlePercentChange,
      colSpan: 1,
    },
    {
      label: "Cartão (Taxa fixa)",
      key: "cardFixed" as const,
      prefix: "R$",
      onChange: handleCurrencyChange,
      colSpan: 2,
    },
    {
      label: "Cartão (à vista)",
      key: "card1x" as const,
      suffix: "%",
      onChange: handlePercentChange,
      colSpan: 1,
    },
    ...Array.from({ length: 11 }, (_, i) => ({
      label: `Cartão (${i + 2} parcelas)`,
      key: `card${i + 2}x` as keyof typeof fees,
      suffix: "%",
      onChange: handlePercentChange,
      colSpan: 1,
    })),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Alterar Taxas</SheetTitle>
          <SheetDescription>
            {acquirer
              ? `Alterando taxas para ${acquirer}. Esta ação pode afetar os custos de transação.`
              : "Deseja alterar as taxas desta empresa? Esta ação pode afetar os custos de transação."}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 grid-cols-2 grid gap-4 mt-4">
          {feeFields.map((field) => (
            <div key={field.key} className={field.colSpan === 2 ? "col-span-2" : ""}>
              <Label>{field.label}</Label>
              <div className="relative mt-1">
                {field.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{field.prefix}</span>
                )}
                <Input
                  value={fees[field.key]}
                  onChange={(e) => field.onChange?.(field.key, e.target.value)}
                  className={field.prefix ? "pl-10" : field.suffix ? "pr-10" : ""}
                />
                {field.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {field.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="col-span-2 flex items-center justify-between mt-2">
            <Label htmlFor="retry-card">Ativar retentativa de cartão</Label>
            <Switch id="retry-card" checked={retryCard} onCheckedChange={setRetryCard} />
          </div>

          <div className="col-span-2 flex items-center justify-between">
            <Label htmlFor="retry-pix">Ativar retentativa de Pix</Label>
            <Switch id="retry-pix" checked={retryPix} onCheckedChange={setRetryPix} />
          </div>

          {paymentFields.map((field) => (
            <div key={field.key} className={field.colSpan === 2 ? "col-span-2" : ""}>
              <Label>{field.label}</Label>
              <div className="relative mt-1">
                {field.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{field.prefix}</span>
                )}
                <Input
                  value={fees[field.key]}
                  onChange={(e) => field.onChange?.(field.key, e.target.value)}
                  className={field.prefix ? "pl-10" : field.suffix ? "pr-10" : ""}
                />
                {field.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {field.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <SheetFooter className="flex flex-row w-full mt-6 gap-2">
          <Button className="w-1/2" variant="outline" onClick={handleReset}>
            Redefinir Taxas
          </Button>
          <Button className="w-1/2" variant="primary" onClick={handleConfirm}>
            Confirmar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
