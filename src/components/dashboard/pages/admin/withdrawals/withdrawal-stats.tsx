"use client";

import { BadgeDollarSign, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/ui/stat-card";
import { adminService } from "@/lib/api/admin-service";
import type { WithdrawalListResponse } from "@/types/withdrawals";

export interface WithdrawalsItem {
  value: number;
  status: "Pendente" | "Finalizado" | "Recusado";
  created: Date;
}

export function adaptWithdrawal(w: WithdrawalListResponse): WithdrawalsItem {
  return {
    value: w.amount,
    created: new Date(w.requestedAt),
    status:
      w.status === "COMPLETED"
        ? "Finalizado"
        : w.status === "REQUESTED" || w.status === "PROCESSING"
          ? "Pendente"
          : "Recusado",
  };
}

export default function WithdrawalStats() {
  const [totalValue, setTotalValue] = useState<number | null>(null);
  const [pendingValue, setPendingValue] = useState<number | null>(null);
  const [approvedCount, setApprovedCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [list, setList] = useState<WithdrawalsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  };

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const withdrawalsResponse = await adminService.getWithdrawalsDashboardData();

        if (withdrawalsResponse.success) {
          setTotalValue(withdrawalsResponse.data.totalAmountApproved);
          setApprovedCount(withdrawalsResponse.data.qtdWithdrawalsApproved);
          setPendingValue(withdrawalsResponse.data.totalAmountPending);
          setPendingCount(withdrawalsResponse.data.qtdWithdrawalsPending);
        } else {
          toast.error("Erro ao buscar dados de Saques");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro interno não esperado");
      } finally {
        setLoading(false);
      }
    };

    const loadWithdrawals = async () => {
      try {
        const response = await adminService.getWithdrawalsRequest(1, 50);

        if (!response.success || !response.data) {
          toast.error("Erro ao carregar solicitações");
          return;
        }

        const raw = Array.isArray(response.data) ? response.data : (response.data.data ?? []);
        const mapped = raw.map(adaptWithdrawal);

        setList(mapped);
      } catch (error) {
        console.error(error);
        toast.error("Não foi possível carregar as solicitações");
      }
    };

    getDashboardData();
    loadWithdrawals();
  }, []);

  function groupByDay(list: WithdrawalsItem[]) {
    return list.reduce(
      (acc, w) => {
        const day = w.created.toISOString().slice(0, 10);
        if (!acc[day]) acc[day] = [];
        acc[day].push(w);
        return acc;
      },
      {} as Record<string, WithdrawalsItem[]>,
    );
  }

  const groupApproved = groupByDay(list.filter((w) => w.status === "Finalizado"));
  const groupPending = groupByDay(list.filter((w) => w.status === "Pendente"));

  const totalValueChartData = Object.entries(groupApproved)
    .map(([day, items]) => ({
      date: day,
      value: items.reduce((sum, w) => sum + w.value, 0),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const approvedCountChartData = Object.entries(groupApproved)
    .map(([day, items]) => ({
      date: day,
      value: items.length,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pendingCountChartData = Object.entries(groupPending)
    .map(([day, items]) => ({ date: day, value: items.length }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const processingValueChartData = Object.entries(groupPending)
    .map(([day, items]) => ({
      date: day,
      value: items.reduce((sum, w) => sum + w.value, 0),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (loading) return <p>Carregando informações...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <StatCard
        icon={BadgeDollarSign}
        title="Total de Saques Aprovados"
        value={totalValue ?? 0}
        chartData={totalValueChartData}
        chartColor="142, 76%, 36%"
        formatValue={formatCurrency}
      />

      <StatCard
        icon={CheckCircle2}
        title="Saques Aprovados"
        value={approvedCount ?? 0}
        chartData={approvedCountChartData}
        chartColor="142, 76%, 36%"
      />

      <StatCard
        icon={Clock}
        title="Saques Pendentes"
        value={pendingCount ?? 0}
        chartData={pendingCountChartData}
        chartColor="45, 93%, 47%"
      />

      <StatCard
        icon={BadgeDollarSign}
        title="Valor em Processamento"
        value={pendingValue ?? 0}
        chartData={processingValueChartData}
        chartColor="217, 91%, 60%"
        formatValue={formatCurrency}
      />
    </div>
  );
}
