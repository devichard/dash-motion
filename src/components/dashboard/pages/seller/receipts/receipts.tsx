"use client";

import { Clock, DollarSign, Hourglass, PiggyBank } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sellerBalancesService } from "@/lib/api/seller-balances-service";
import { withdrawalsService } from "@/lib/api/withdrawal-service";
import type { SellerBalances } from "@/types/seller-balances";
import OperationModal from "./operatioModal";
import Table from "./table";

type ModalType = "saque" | "antecipacao" | "reserva" | null;
type SaqueOption = "Pix" | "Cripto" | "Copia e Cola" | "QR Code";

export default function Receipts() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [modalType, setModalType] = useState<ModalType>(null);
  const [saqueOption, setSaqueOption] = useState<SaqueOption>("Pix");
  const [valor, setValor] = useState<string | undefined>();
  const [pixKey, setPixKey] = useState("");
  const [motivo, setMotivo] = useState("");

  const [balances, setBalances] = useState<SellerBalances | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const response = await sellerBalancesService.get();
        console.log("Resposta completa:", response);
        if (response.success) {
          // O backend retorna SellerBalances diretamente ou null
          // O apiClient pode retornar o objeto diretamente ou null
          let balancesData: SellerBalances | null = null;

          if (response.data === null) {
            // Backend retornou null - não há saldos criados
            balancesData = null;
          } else if (typeof response.data === "object") {
            // Verificar se é um objeto SellerBalances válido
            if ("sellerId" in response.data || "availableBalance" in response.data) {
              balancesData = response.data as SellerBalances;
            } else {
              // Se não tem as propriedades esperadas, pode ser que o apiClient extraiu algo errado
              console.warn("Estrutura de dados inesperada:", response.data);
              balancesData = null;
            }
          }

          if (balancesData) {
            console.log("Saldos carregados:", balancesData);
            setBalances(balancesData);
          } else {
            // Criar saldos padrão com valores zerados quando não existem
            console.log("Criando saldos padrão zerados");
            setBalances({
              sellerId: "",
              pendingBalance: 0,
              availableBalance: 0,
              reservedBalance: 0,
              updatedAt: new Date(),
            });
          }
        } else {
          console.error("Erro ao buscar saldos:", response.errorMessage || response);
          // Em caso de erro, também usar valores padrão zerados
          setBalances({
            sellerId: "",
            pendingBalance: 0,
            availableBalance: 0,
            reservedBalance: 0,
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        console.error("Erro de requisição:", error);
        // Em caso de erro, usar valores padrão zerados
        setBalances({
          sellerId: "",
          pendingBalance: 0,
          availableBalance: 0,
          reservedBalance: 0,
          updatedAt: new Date(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, []);

  const handleClose = () => {
    setModalType(null);
    setValor(undefined);
    setPixKey("");
    setMotivo("");
    setSaqueOption("Pix");
  };

  const getSaldoAtual = () => {
    if (!balances) return 0;
    switch (modalType) {
      case "saque":
        return balances.availableBalance;
      case "antecipacao":
        return balances.pendingBalance;
      case "reserva":
        return balances.reservedBalance;
      default:
        return 0;
    }
  };

  const handleConfirm = async () => {
    try {
      if (!valor || !pixKey) return;

      const response = await withdrawalsService.create({
        amount: Number(valor),
        pixKey,
      });

      if (!response.success) {
        toast.error(response.errorMessage);
        return;
      }

      toast.success(`Solicitação de saque de R$ ${response.data.amount} criada com sucesso`);

      handleClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado ao solicitar saque.");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando saldos...</div>;
  }

  if (!balances) {
    return <div className="text-center py-8 text-muted-foreground">Carregando saldos...</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
              <DollarSign className="size-4" />
              Saldo disponível
            </CardDescription>
            <CardTitle className="text-3xl font-medium">
              <NumberTicker value={balances.availableBalance} variant="currency" decimalPlaces={2} />
            </CardTitle>
            <Button className="w-full mt-2" onClick={() => setModalType("saque")} variant="primary">
              Solicitar saque
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              Saldo pendente
            </CardDescription>
            <CardTitle className="text-3xl font-medium">
              <NumberTicker value={balances.pendingBalance} variant="currency" decimalPlaces={2} />
            </CardTitle>
            <Button disabled variant="outline" className="w-full mt-2" onClick={() => setModalType("antecipacao")}>
              Solicitar antecipação
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
              <Hourglass className="size-4" />
              Aguardando antecipação
            </CardDescription>
            <CardTitle className="text-3xl font-medium">
              <NumberTicker value={0} variant="currency" decimalPlaces={2} />
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
              <PiggyBank className="size-4" />
              Reserva financeira
            </CardDescription>
            <CardTitle className="text-3xl font-medium">
              <NumberTicker value={balances.reservedBalance} variant="currency" decimalPlaces={2} />
            </CardTitle>
            <Button disabled variant="outline" className="w-full mt-2" onClick={() => setModalType("reserva")}>
              Nova reserva
            </Button>
          </CardHeader>
        </Card>
      </div>

      <div className="lg:col-span-4 mt-6">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Pagamento">Pagamentos</SelectItem>
            <SelectItem value="Reserva financeira">Reservas</SelectItem>
            <SelectItem value="Saque">Saques</SelectItem>
            <SelectItem value="Taxa">Taxas</SelectItem>
          </SelectContent>
        </Select>

        <div className="mt-3">
          <Table statusFilter={statusFilter} />
        </div>
      </div>

      {modalType && (
        <OperationModal
          open={!!modalType}
          onClose={handleClose}
          onConfirm={handleConfirm}
          type={modalType}
          valor={valor}
          onChangeValor={setValor}
          pixKey={pixKey}
          onChangePixKey={setPixKey}
          saqueOption={saqueOption}
          onChangeSaqueOption={setSaqueOption}
          motivo={motivo}
          onChangeMotivo={setMotivo}
          saldo={getSaldoAtual()}
        />
      )}
    </>
  );
}
