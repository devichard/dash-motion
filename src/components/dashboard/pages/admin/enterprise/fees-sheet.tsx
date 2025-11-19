"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { systemFeesService } from "@/lib/api/fees-service";
import type { NewFee, SystemFees } from "@/types/fees";

interface FeesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enterpriseName?: string;
  cnpj?: string;
  sellerId?: string;
  onFeesSaved?: () => void;
}

const DEFAULT_FEES = {
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

const formatCurrencyValue = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatPercentValue = (value: number): string => {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function FeesSheet({ open, onOpenChange, enterpriseName, cnpj, sellerId, onFeesSaved }: FeesSheetProps) {
  const [fees, setFees] = useState(DEFAULT_FEES);
  const [loading, setLoading] = useState(false);
  const [loadingFees, setLoadingFees] = useState(false);

  useEffect(() => {
    if (!open) {
      setFees(DEFAULT_FEES);
    }
  }, [open]);

  useEffect(() => {
    const loadSellerFees = async () => {
      if (open && sellerId) {
        if (!sellerId || sellerId.trim() === "") {
          setLoadingFees(false);
          return;
        }

        setLoadingFees(true);
        try {
          const response = await systemFeesService.findBySellerId(sellerId);
          if (response.success && response.data) {
            const updatedFees = { ...DEFAULT_FEES };

            response.data.forEach((fee: SystemFees) => {
              if (fee.description === "Pix (Taxa fixa)" && fee.feeType === "FIXED") {
                updatedFees.pixFixed = formatCurrencyValue(fee.feeValue);
              } else if (fee.description === "Pix (Taxa variável)" && fee.feeType === "PERCENTAGE") {
                updatedFees.pixVariable = formatPercentValue(fee.feeValue);
              }
            });

            setFees(updatedFees);
          }
        } catch (error) {
          console.error("Failed to load seller fees:", error);
        } finally {
          setLoadingFees(false);
        }
      }
    };

    loadSellerFees();
  }, [open, sellerId]);

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

  const parseNumericValue = (value: string): number => {
    return parseFloat(value.replace(/\./g, "").replace(",", "."));
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
  };

  const handleConfirm = async () => {
    if (!sellerId) {
      toast.error("ID do vendedor não encontrado");
      return;
    }

    setLoading(true);

    try {
      const feesData: NewFee[] = [];

      feesData.push({
        sellerId: sellerId, // Make sure sellerId is included
        feeType: "FIXED",
        feeValue: parseNumericValue(fees.pixFixed),
        description: "Pix (Taxa fixa)",
      });

      feesData.push({
        sellerId: sellerId, // Make sure sellerId is included
        feeType: "PERCENTAGE",
        feeValue: parseNumericValue(fees.pixVariable),
        description: "Pix (Taxa variável)",
      });

      const response = await systemFeesService.setSellerFees(sellerId, feesData);

      if (response.success) {
        toast.success("Taxas atualizadas com sucesso!");
        onOpenChange(false);
        if (onFeesSaved) onFeesSaved();
      } else {
        toast.error(response.errorMessage || "Erro ao atualizar taxas");
      }
    } catch (error) {
      console.error("Failed to save fees:", error);
      toast.error("Erro ao salvar taxas");
    } finally {
      setLoading(false);
    }
  };

  type FeeField = {
    label: string;
    key: keyof typeof fees;
    prefix?: string;
    suffix?: string;
    onChange: (key: keyof typeof fees, value: string) => void;
    colSpan: number;
    disabled?: boolean;
  };

  const feeFields: FeeField[] = [
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
      disabled: true,
    },
    {
      label: "Boleto (Taxa variável)",
      key: "boletoVariable" as const,
      suffix: "%",
      onChange: handlePercentChange,
      colSpan: 1,
      disabled: true,
    },
    {
      label: "Cartão (Taxa fixa)",
      key: "cardFixed" as const,
      prefix: "R$",
      onChange: handleCurrencyChange,
      colSpan: 2,
      disabled: true,
    },
    {
      label: "Cartão (à vista)",
      key: "card1x" as const,
      suffix: "%",
      onChange: handlePercentChange,
      colSpan: 1,
      disabled: true,
    },
    ...Array.from({ length: 11 }, (_, i) => ({
      label: `Cartão (${i + 2} parcelas)`,
      key: `card${i + 2}x` as keyof typeof fees,
      suffix: "%",
      onChange: handlePercentChange,
      colSpan: 1,
      disabled: true,
    })),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Alterar Taxas</SheetTitle>
          <SheetDescription>
            {enterpriseName && cnpj
              ? `Alterando taxas para ${enterpriseName} (${cnpj}). Esta ação pode afetar os custos de transação.`
              : "Deseja alterar as taxas deste vendedor? Esta ação pode afetar os custos de transação."}
          </SheetDescription>
        </SheetHeader>
        {loadingFees ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="px-4 grid-cols-2 grid gap-4 mt-4">
              {feeFields.map((field) => (
                <div key={field.key} className={field.colSpan === 2 ? "col-span-2" : ""}>
                  <Label className={field.disabled ? "opacity-50" : ""}>{field.label}</Label>
                  <div className="relative mt-1">
                    {field.prefix && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {field.prefix}
                      </span>
                    )}
                    <Input
                      value={fees[field.key]}
                      onChange={(e) => field.onChange(field.key, e.target.value)}
                      className={field.prefix ? "pl-10" : field.suffix ? "pr-10" : ""}
                      disabled={field.disabled}
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
              <Button className="w-1/2" variant="outline" onClick={handleReset} disabled={loading}>
                Redefinir Taxas
              </Button>
              <Button className="w-1/2" variant="primary" onClick={handleConfirm} disabled={loading}>
                {loading ? "Salvando..." : "Confirmar"}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
