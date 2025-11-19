"use client";

import { ArrowRight, Bitcoin, Clock, PiggyBank, Wallet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { systemFeesService } from "@/lib/api/fees-service";
import type { SystemFees } from "@/types/fees";

type ModalType = "saque" | "antecipacao" | "reserva";
type SaqueOption = "Pix" | "Cripto" | "Copia e Cola" | "QR Code";

interface OperationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: ModalType;
  valor: string | undefined;
  onChangeValor: (valor: string) => void;
  pixKey: string;
  onChangePixKey: (v: string) => void;
  saqueOption: SaqueOption;
  onChangeSaqueOption: (v: SaqueOption) => void;
  motivo: string;
  onChangeMotivo: (v: string) => void;
  saldo: number;
}

export default function OperationModal({
  open,
  onClose,
  onConfirm,
  type,
  valor,
  onChangeValor,
  pixKey,
  onChangePixKey,
  saqueOption,
  onChangeSaqueOption,
  motivo,
  onChangeMotivo,
  saldo,
}: OperationModalProps) {
  const [fee, setFee] = useState<SystemFees[] | null>(null);
  const [loading, setLoading] = useState(true);

  const withdrawalFee = fee?.find((f) => f.feeType === "FIXED" && f.description?.includes("Withdrawal"));
  const feeValue = withdrawalFee?.feeValue ?? 0;
  const valorLiquido = useMemo(
    () => (Number(valor) && Number(valor) > feeValue ? Number(valor) - feeValue : 0),
    [valor, feeValue],
  );

  useEffect(() => {
    const loadFees = async () => {
      try {
        const response = await systemFeesService.listSellerFees();

        if (Array.isArray(response)) {
          setFee(response);
        } else if (response.success) {
          setFee(response.data || []);
        } else {
          setFee([]);
        }
      } catch (error) {
        console.error("Erro ao buscar taxas:", error);
        setFee([]);
      } finally {
        setLoading(false);
      }
    };

    loadFees();
  }, []);

  if (loading) {
    return <div className="text-center text-muted-foreground">Carregando taxas...</div>;
  }

  const renderTaxaInfo = (
    <div className="bg-muted/30 rounded-md p-3 space-y-1">
      <p className="text-sm text-muted-foreground">
        Taxa de operação: <strong>R$ {(Number(feeValue) || 0).toFixed(2)}</strong>
      </p>
      <p className="text-sm text-muted-foreground">Valor líquido a receber:</p>
      <p className="font-semibold text-lg">
        {Number(valor) && Number(valor) > 0
          ? `R$ ${valorLiquido.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}`
          : "—"}
      </p>
      {!Number.isNaN(Number(valor)) && Number(valor) <= feeValue && (
        <p className="text-xs text-red-500 mt-1">
          Valor insuficiente para cobrir a taxa de R$ {(Number(feeValue) || 0).toFixed(2)}
        </p>
      )}
    </div>
  );

  const titleMap = {
    saque: {
      icon: <Wallet className="text-primary" />,
      title: "Saque seu dinheiro",
    },
    antecipacao: {
      icon: <Clock className="text-primary" />,
      title: "Solicitar antecipação",
    },
    reserva: {
      icon: <PiggyBank className="text-primary" />,
      title: "Criar reserva financeira",
    },
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg p-6 space-y-6">
        <div className="flex items-center gap-2">
          {titleMap[type].icon}
          <DialogTitle className="text-lg font-semibold">{titleMap[type].title}</DialogTitle>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 flex justify-between">
          <span className="text-sm text-muted-foreground">Saldo disponível</span>
          <span className="font-semibold text-lg">R$ {saldo.toLocaleString()}</span>
        </div>

        <div>
          <Label>
            {type === "reserva" ? "Valor da reserva" : type === "antecipacao" ? "Valor a antecipar" : "Valor do saque"}
          </Label>
          <Input
            type="number"
            value={valor}
            onChange={(e) => onChangeValor(e.target.value)}
            placeholder="Digite o valor"
          />
        </div>

        {type === "saque" && (
          <div>
            <Label>Método de saque</Label>
            <Select value={saqueOption} onValueChange={onChangeSaqueOption}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pix">Pix</SelectItem>
              </SelectContent>
            </Select>

            {saqueOption === "Pix" && (
              <div className="mt-3">
                <Label>Chave Pix</Label>
                <Input
                  placeholder="Digite sua chave Pix: (CPF, CNPJ, e-mail, telefone ou EVP)"
                  value={pixKey}
                  onChange={(e) => onChangePixKey(e.target.value)}
                />
              </div>
            )}

            {saqueOption === "Cripto" && (
              <div className="mt-3">
                <Label>Endereço da carteira</Label>
                <Input placeholder="Ex: 0xABC123..." />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Bitcoin className="h-3 w-3" /> Rede: Ethereum, BSC, Polygon
                </p>
              </div>
            )}
          </div>
        )}

        {type === "reserva" && (
          <div>
            <Label>Motivo</Label>
            <Input
              placeholder="Ex: Fundo de emergência, investimento..."
              value={motivo}
              onChange={(e) => onChangeMotivo(e.target.value)}
            />
          </div>
        )}

        {renderTaxaInfo}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            disabled={!valor || Number(valor) <= feeValue || Number(valor) < 100}
            onClick={onConfirm}
          >
            Confirmar <ArrowRight size={16} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
