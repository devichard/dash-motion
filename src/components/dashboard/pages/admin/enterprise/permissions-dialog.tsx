"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PermissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enterpriseName?: string;
  cnpj?: string;
}

const DEFAULT_PERMISSIONS = {
  // Métodos de Pagamento
  pix: true,
  creditCard: true,
  boleto: true,
  pixRecurring: false,
  cardRecurring: false,

  // Regras de Ticket
  maxTicketPix: "600.00",
  maxTicketCard: "500.00",
  maxTicketBoleto: "1200.00",

  // Regras de Estornos
  preChargebackEnabled: true,
  preChargebackValue: "130.00",
  chargeBalance: true,
  chargePreChargeback: true,
  chargeRefunds: true,
  returnTransactionFees: false,

  // Regras de Transferências
  transferEnabled: true,
  transferValidation: "automatic" as "automatic" | "manual" | "analysis",
  transferFixedFee: "12.00",
  transferPercentFee: "0.00",
  transferMinValue: "20.00",
  transferMaxValue: "5000.00",
  validateOwnership: true,
  enableDailyLimit: true,
  dailyTransferLimit: "50000.00",
  transferDelayMinutes: "0",
  allowWithdrawalAPI: false,

  // Regras de Transferências Cripto
  cryptoTransferEnabled: true,
  cryptoTransferValidation: "automatic" as "automatic" | "manual" | "analysis",
  cryptoFixedFee: "12.00",
  cryptoPercentFee: "4.50",
  cryptoMinValue: "20.00",
  cryptoMaxValue: "10000.00",
  cryptoDailyLimit: "0.00",
  cryptoDelayMinutes: "0",
  allowCryptoWithdrawalAPI: false,
  allowCryptoWalletCreation: false,

  // Regras de Antecipação
  anticipationEnabled: true,
  anticipationValidation: "automatic" as "automatic" | "manual" | "analysis",
  anticipationVolume: "100.00",
  anticipationRate: "9.00",
  minDaysToAnticipate: 2,
  anticipationDelayMinutes: "0",

  // Liberação de Valores
  pixReleaseDays: "0",
  cardReleaseDays: "30",
  boletoReleaseDays: "1",
};

export default function PermissionsDialog({ open, onOpenChange, enterpriseName, cnpj }: PermissionsDialogProps) {
  const [permissions, setPermissions] = useState(DEFAULT_PERMISSIONS);

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = Number(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercent = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = Number(numbers) / 100;
    return amount.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleCurrencyChange = (key: keyof typeof permissions, value: string) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: formatCurrency(value),
    }));
  };

  const handlePercentChange = (key: keyof typeof permissions, value: string) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: formatPercent(value),
    }));
  };

  const handleCheckboxChange = (key: keyof typeof permissions, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSelectChange = (key: keyof typeof permissions, value: "automatic" | "manual" | "analysis") => {
    setPermissions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNumberChange = (key: keyof typeof permissions, value: string) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const incrementDays = (key: keyof typeof permissions) => {
    const currentValue = Number(permissions[key]);
    setPermissions((prev) => ({
      ...prev,
      [key]: String(currentValue + 1),
    }));
  };

  const decrementDays = (key: keyof typeof permissions) => {
    const currentValue = Number(permissions[key]);
    if (currentValue > 0) {
      setPermissions((prev) => ({
        ...prev,
        [key]: String(currentValue - 1),
      }));
    }
  };

  const handleReset = () => {
    setPermissions(DEFAULT_PERMISSIONS);
  };

  const handleConfirm = () => {
    // TODO: Implement API call to save permissions
    console.log("Saving permissions:", permissions);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Permissões da Empresa</DialogTitle>
          {enterpriseName && cnpj && (
            <DialogDescription>
              Configurando permissões para {enterpriseName} ({cnpj})
            </DialogDescription>
          )}
        </DialogHeader>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="payment-methods">
            <AccordionTrigger>Métodos de Pagamento</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pix"
                  checked={permissions.pix}
                  onCheckedChange={(checked) => handleCheckboxChange("pix", checked as boolean)}
                />
                <Label htmlFor="pix" className="cursor-pointer">
                  PIX
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="creditCard"
                  checked={permissions.creditCard}
                  onCheckedChange={(checked) => handleCheckboxChange("creditCard", checked as boolean)}
                />
                <Label htmlFor="creditCard" className="cursor-pointer">
                  Cartão de Crédito
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="boleto"
                  checked={permissions.boleto}
                  onCheckedChange={(checked) => handleCheckboxChange("boleto", checked as boolean)}
                />
                <Label htmlFor="boleto" className="cursor-pointer">
                  Boleto
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pixRecurring"
                  checked={permissions.pixRecurring}
                  onCheckedChange={(checked) => handleCheckboxChange("pixRecurring", checked as boolean)}
                />
                <Label htmlFor="pixRecurring" className="cursor-pointer">
                  Retentativa de Pix
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cardRecurring"
                  checked={permissions.cardRecurring}
                  onCheckedChange={(checked) => handleCheckboxChange("cardRecurring", checked as boolean)}
                />
                <Label htmlFor="cardRecurring" className="cursor-pointer">
                  Retentativa de Cartão
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ticket-rules">
            <AccordionTrigger>Regras de Ticket</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div>
                <Label htmlFor="maxTicketPix">Ticket Máximo (PIX)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    id="maxTicketPix"
                    value={permissions.maxTicketPix}
                    onChange={(e) => handleCurrencyChange("maxTicketPix", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="maxTicketCard">Ticket Máximo (CARTÃO)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    id="maxTicketCard"
                    value={permissions.maxTicketCard}
                    onChange={(e) => handleCurrencyChange("maxTicketCard", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="maxTicketBoleto">Ticket Máximo (BOLETO)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    id="maxTicketBoleto"
                    value={permissions.maxTicketBoleto}
                    onChange={(e) => handleCurrencyChange("maxTicketBoleto", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="refund-rules">
            <AccordionTrigger>Regras de Estornos</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preChargebackEnabled"
                  checked={permissions.preChargebackEnabled}
                  onCheckedChange={(checked) => handleCheckboxChange("preChargebackEnabled", checked as boolean)}
                />
                <Label htmlFor="preChargebackEnabled" className="cursor-pointer">
                  Serviço de Pré-Chargeback (ETHOKA/VERIFI)
                </Label>
              </div>
              <div>
                <Label htmlFor="preChargebackValue">Valor do Pré-Chargeback</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    id="preChargebackValue"
                    value={permissions.preChargebackValue}
                    onChange={(e) => handleCurrencyChange("preChargebackValue", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chargeBalance"
                  checked={permissions.chargeBalance}
                  onCheckedChange={(checked) => handleCheckboxChange("chargeBalance", checked as boolean)}
                />
                <Label htmlFor="chargeBalance" className="cursor-pointer">
                  Cobrar estorno do saldo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chargePreChargeback"
                  checked={permissions.chargePreChargeback}
                  onCheckedChange={(checked) => handleCheckboxChange("chargePreChargeback", checked as boolean)}
                />
                <Label htmlFor="chargePreChargeback" className="cursor-pointer">
                  Cobrar pré-chargeback do saldo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="chargeRefunds"
                  checked={permissions.chargeRefunds}
                  onCheckedChange={(checked) => handleCheckboxChange("chargeRefunds", checked as boolean)}
                />
                <Label htmlFor="chargeRefunds" className="cursor-pointer">
                  Cobrar pré-chargeback em estornos
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="returnTransactionFees"
                  checked={permissions.returnTransactionFees}
                  onCheckedChange={(checked) => handleCheckboxChange("returnTransactionFees", checked as boolean)}
                />
                <Label htmlFor="returnTransactionFees" className="cursor-pointer">
                  Devolver taxas da transação no estorno
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transfer-rules">
            <AccordionTrigger>Regras de Transferências</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="transferEnabled"
                  checked={permissions.transferEnabled}
                  onCheckedChange={(checked) => handleCheckboxChange("transferEnabled", checked as boolean)}
                />
                <Label htmlFor="transferEnabled" className="cursor-pointer">
                  Transferência habilitada
                </Label>
              </div>
              <div>
                <Label htmlFor="transferValidation">Validação de Transferências</Label>
                <Select
                  value={permissions.transferValidation}
                  onValueChange={(value) =>
                    handleSelectChange("transferValidation", value as "automatic" | "manual" | "analysis")
                  }
                >
                  <SelectTrigger id="transferValidation" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analysis">Enviar para análise</SelectItem>
                    <SelectItem value="automatic">Automática</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transferFixedFee">Taxa por Transferência (FIXA)</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="transferFixedFee"
                      value={permissions.transferFixedFee}
                      onChange={(e) => handleCurrencyChange("transferFixedFee", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="transferPercentFee">Taxa por Transferência (%)</Label>
                  <div className="relative mt-1">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    <Input
                      id="transferPercentFee"
                      value={permissions.transferPercentFee}
                      onChange={(e) => handlePercentChange("transferPercentFee", e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transferMinValue">Valor mínimo por transferência</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="transferMinValue"
                      value={permissions.transferMinValue}
                      onChange={(e) => handleCurrencyChange("transferMinValue", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="transferMaxValue">Valor máximo por transferência</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="transferMaxValue"
                      value={permissions.transferMaxValue}
                      onChange={(e) => handleCurrencyChange("transferMaxValue", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="validateOwnership"
                  checked={permissions.validateOwnership}
                  onCheckedChange={(checked) => handleCheckboxChange("validateOwnership", checked as boolean)}
                />
                <Label htmlFor="validateOwnership" className="cursor-pointer">
                  Validar titularidade nas transferências
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableDailyLimit"
                  checked={permissions.enableDailyLimit}
                  onCheckedChange={(checked) => handleCheckboxChange("enableDailyLimit", checked as boolean)}
                />
                <Label htmlFor="enableDailyLimit" className="cursor-pointer">
                  Habilitar limite de transferências no dia
                </Label>
              </div>
              <div>
                <Label htmlFor="dailyTransferLimit">Limite de transferências no dia</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    id="dailyTransferLimit"
                    value={permissions.dailyTransferLimit}
                    onChange={(e) => handleCurrencyChange("dailyTransferLimit", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="transferDelayMinutes">Delay entre transferências (minutos)</Label>
                <Input
                  id="transferDelayMinutes"
                  type="number"
                  value={permissions.transferDelayMinutes}
                  onChange={(e) => handleNumberChange("transferDelayMinutes", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowWithdrawalAPI"
                  checked={permissions.allowWithdrawalAPI}
                  onCheckedChange={(checked) => handleCheckboxChange("allowWithdrawalAPI", checked as boolean)}
                />
                <Label htmlFor="allowWithdrawalAPI" className="cursor-pointer">
                  Permitir solicitação de saque via API
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="crypto-transfer-rules">
            <AccordionTrigger>Regras de Transferências Cripto</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cryptoTransferEnabled"
                  checked={permissions.cryptoTransferEnabled}
                  onCheckedChange={(checked) => handleCheckboxChange("cryptoTransferEnabled", checked as boolean)}
                />
                <Label htmlFor="cryptoTransferEnabled" className="cursor-pointer">
                  Transferência habilitada
                </Label>
              </div>
              <div>
                <Label htmlFor="cryptoTransferValidation">Validação de Transferências</Label>
                <Select
                  value={permissions.cryptoTransferValidation}
                  onValueChange={(value) =>
                    handleSelectChange("cryptoTransferValidation", value as "automatic" | "manual" | "analysis")
                  }
                >
                  <SelectTrigger id="cryptoTransferValidation" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analysis">Enviar para análise</SelectItem>
                    <SelectItem value="automatic">Automática</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cryptoFixedFee">Taxa por Transferência (FIXA)</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="cryptoFixedFee"
                      value={permissions.cryptoFixedFee}
                      onChange={(e) => handleCurrencyChange("cryptoFixedFee", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cryptoPercentFee">Taxa por Transferência (%)</Label>
                  <div className="relative mt-1">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    <Input
                      id="cryptoPercentFee"
                      value={permissions.cryptoPercentFee}
                      onChange={(e) => handlePercentChange("cryptoPercentFee", e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cryptoMinValue">Valor mínimo por transferência</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="cryptoMinValue"
                      value={permissions.cryptoMinValue}
                      onChange={(e) => handleCurrencyChange("cryptoMinValue", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cryptoMaxValue">Valor máximo por transferência</Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                    <Input
                      id="cryptoMaxValue"
                      value={permissions.cryptoMaxValue}
                      onChange={(e) => handleCurrencyChange("cryptoMaxValue", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cryptoEnableDailyLimit"
                  checked={permissions.enableDailyLimit}
                  onCheckedChange={(checked) => handleCheckboxChange("enableDailyLimit", checked as boolean)}
                />
                <Label htmlFor="cryptoEnableDailyLimit" className="cursor-pointer">
                  Habilitar limite de transferências no dia
                </Label>
              </div>
              <div>
                <Label htmlFor="cryptoDailyLimit">Limite de transferências no dia</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                  <Input
                    id="cryptoDailyLimit"
                    value={permissions.cryptoDailyLimit}
                    onChange={(e) => handleCurrencyChange("cryptoDailyLimit", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cryptoDelayMinutes">Delay entre transferências (minutos)</Label>
                <Input
                  id="cryptoDelayMinutes"
                  type="number"
                  value={permissions.cryptoDelayMinutes}
                  onChange={(e) => handleNumberChange("cryptoDelayMinutes", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowCryptoWithdrawalAPI"
                  checked={permissions.allowCryptoWithdrawalAPI}
                  onCheckedChange={(checked) => handleCheckboxChange("allowCryptoWithdrawalAPI", checked as boolean)}
                />
                <Label htmlFor="allowCryptoWithdrawalAPI" className="cursor-pointer">
                  Permitir Saque Cripto via API
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowCryptoWalletCreation"
                  checked={permissions.allowCryptoWalletCreation}
                  onCheckedChange={(checked) => handleCheckboxChange("allowCryptoWalletCreation", checked as boolean)}
                />
                <Label htmlFor="allowCryptoWalletCreation" className="cursor-pointer">
                  Permitir Criação de Carteira Cripto via API
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="anticipation-rules">
            <AccordionTrigger>Regras de Antecipação</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anticipationEnabled"
                  checked={permissions.anticipationEnabled}
                  onCheckedChange={(checked) => handleCheckboxChange("anticipationEnabled", checked as boolean)}
                />
                <Label htmlFor="anticipationEnabled" className="cursor-pointer">
                  Antecipação habilitada
                </Label>
              </div>
              <div>
                <Label htmlFor="anticipationValidation">Validação de Antecipação</Label>
                <Select
                  value={permissions.anticipationValidation}
                  onValueChange={(value) =>
                    handleSelectChange("anticipationValidation", value as "automatic" | "manual" | "analysis")
                  }
                >
                  <SelectTrigger id="anticipationValidation" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analysis">Enviar para análise</SelectItem>
                    <SelectItem value="automatic">Automática</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="anticipationVolume">Volume Antecipável (%)</Label>
                <div className="relative mt-1">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  <Input
                    id="anticipationVolume"
                    value={permissions.anticipationVolume}
                    onChange={(e) => handlePercentChange("anticipationVolume", e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="anticipationRate">Taxa de Antecipação (%)</Label>
                <div className="relative mt-1">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  <Input
                    id="anticipationRate"
                    value={permissions.anticipationRate}
                    onChange={(e) => handlePercentChange("anticipationRate", e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="minDaysToAnticipate">Mínimo de dias para antecipar (D+X)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => decrementDays("minDaysToAnticipate")}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    id="minDaysToAnticipate"
                    type="number"
                    value={permissions.minDaysToAnticipate}
                    onChange={(e) => handleNumberChange("minDaysToAnticipate", e.target.value)}
                    className="text-center"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => incrementDays("minDaysToAnticipate")}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="anticipationDelayMinutes">Delay entre antecipações (minutos)</Label>
                <Input
                  id="anticipationDelayMinutes"
                  type="number"
                  value={permissions.anticipationDelayMinutes}
                  onChange={(e) => handleNumberChange("anticipationDelayMinutes", e.target.value)}
                  className="mt-1"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="value-release">
            <AccordionTrigger>Liberação de Valores</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Configure quantos dias serão necessários para que os valores recebidos saiam da pendência e sejam
                liberados para esta empresa.
              </p>
              <div>
                <Label htmlFor="pixReleaseDays">Pix - Dias para Liberação</Label>
                <Input
                  id="pixReleaseDays"
                  type="number"
                  value={permissions.pixReleaseDays}
                  onChange={(e) => handleNumberChange("pixReleaseDays", e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Dias necessários para liberar valores do Pix</p>
              </div>
              <div>
                <Label htmlFor="cardReleaseDays">Cartão - Dias para Liberação</Label>
                <Input
                  id="cardReleaseDays"
                  type="number"
                  value={permissions.cardReleaseDays}
                  onChange={(e) => handleNumberChange("cardReleaseDays", e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Dias necessários para liberar valores do cartão</p>
              </div>
              <div>
                <Label htmlFor="boletoReleaseDays">Boleto - Dias para Liberação</Label>
                <Input
                  id="boletoReleaseDays"
                  type="number"
                  value={permissions.boletoReleaseDays}
                  onChange={(e) => handleNumberChange("boletoReleaseDays", e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Dias necessários para liberar valores do boleto</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter className="gap-2">
          <Button className="w-full sm:w-1/2" variant="outline" onClick={handleReset}>
            Redefinir Permissões
          </Button>
          <Button className="w-full sm:w-1/2" variant="primary" onClick={handleConfirm}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
