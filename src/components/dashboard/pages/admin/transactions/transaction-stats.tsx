"use client";

import { BadgeDollarSign, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/ui/stat-card";
import { adminService } from "@/lib/api/admin-service";
import type { TotalTransactionsData } from "@/types/payments";

const stats = {
  totalValue: 13000,
  averageTicket: 290,
  paidCount: 53,
  pendingCount: 8,
};

export default function TransactionStats() {
  const [totalTransactions, setTotalTransactions] = useState<TotalTransactionsData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTotalTransactions = async () => {
      try {
        const response = await adminService.getTotalTransactionsData();
        if (response.success) {
          setTotalTransactions(response.data);
        } else {
          console.error(response.errorMessage);
          toast.error("Erro ao buscar total de transações.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getTotalTransactions();
  }, []);

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  };

  const totalValueChartData = [
    { value: 8500 },
    { value: 9200 },
    { value: 8800 },
    { value: 9500 },
    { value: 10200 },
    { value: 9800 },
    { value: 10500 },
    { value: 11000 },
    { value: 10800 },
    { value: 11500 },
    { value: 12000 },
    { value: 11800 },
    { value: 12500 },
    { value: 13000 },
    { value: stats.totalValue },
  ];

  const averageTicketChartData = [
    { value: 180 },
    { value: 195 },
    { value: 300 },
    { value: 210 },
    { value: 225 },
    { value: 215 },
    { value: 240 },
    { value: 235 },
    { value: 250 },
    { value: 265 },
    { value: 260 },
    { value: 275 },
    { value: 285 },
    { value: 280 },
    { value: stats.averageTicket },
  ];

  const paidCountChartData = [
    { value: 35 },
    { value: 38 },
    { value: 36 },
    { value: 40 },
    { value: 42 },
    { value: 39 },
    { value: 44 },
    { value: 46 },
    { value: 43 },
    { value: 47 },
    { value: 50 },
    { value: 48 },
    { value: 52 },
    { value: 55 },
    { value: stats.paidCount },
  ];

  const pendingCountChartData = [
    { value: 18 },
    { value: 16 },
    { value: 19 },
    { value: 15 },
    { value: 14 },
    { value: 17 },
    { value: 13 },
    { value: 12 },
    { value: 15 },
    { value: 11 },
    { value: 10 },
    { value: 12 },
    { value: 9 },
    { value: 8 },
    { value: stats.pendingCount },
  ];

  if (loading) return <p>Carregando dados...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <StatCard
        icon={BadgeDollarSign}
        title="Total de Transações Pagas"
        value={totalTransactions?.totalAmountWithAllFees ?? 0}
        chartData={totalValueChartData}
        chartColor="142, 76%, 36%"
        formatValue={formatCurrency}
      />

      <StatCard
        icon={BadgeDollarSign}
        title="Total de Transações"
        value={totalTransactions?.totalPayments ?? 0}
        chartData={averageTicketChartData}
        chartColor="217, 91%, 60%"
      />

      <StatCard
        icon={CheckCircle2}
        title="Transações Pagas"
        value={totalTransactions?.totalFinishedPayments ?? 0}
        chartData={paidCountChartData}
        chartColor="142, 76%, 36%"
      />

      <StatCard
        icon={Clock}
        title="Transações Pendentes"
        value={totalTransactions?.totalPendingPayments ?? 0}
        chartData={pendingCountChartData}
        chartColor="0, 84%, 60%"
      />
    </div>
  );
}
