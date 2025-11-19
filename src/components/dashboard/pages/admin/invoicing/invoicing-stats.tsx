"use client";

import { CheckCircle2, Clock, TrendingUp, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatCard } from "@/components/ui/stat-card";
import { adminService } from "@/lib/api/admin-service";
import type { BillingData } from "@/types/payments";

interface InvoicingStatsProps {
  stats?: {
    totalValue: number;
    completedCount: number;
    pendingCount: number;
    rejectedValue: number;
  };
}

export default function InvoicingStats({ stats }: InvoicingStatsProps) {
  const [invoicingData, setInvoicingData] = useState<BillingData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoicingData = async () => {
      try {
        const response = await adminService.getBillingData();
        if (response.success) {
          setInvoicingData(response.data);
        } else {
          toast.error("Erro ao buscar dados");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadInvoicingData();
  }, []);

  const defaultStats = {
    totalValue: 45000,
    completedCount: 28,
    pendingCount: 4,
    rejectedValue: 12000,
  };

  const currentStats = stats || defaultStats;

  const formatCurrency = (value: string | number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(value));
  };

  const totalValueChartData = [
    { value: currentStats.totalValue * 0.65, date: "2024-10-01" },
    { value: currentStats.totalValue * 0.7, date: "2024-10-15" },
    { value: currentStats.totalValue * 0.68, date: "2024-11-01" },
    { value: currentStats.totalValue * 0.74, date: "2024-11-15" },
    { value: currentStats.totalValue * 0.77, date: "2024-12-01" },
    { value: currentStats.totalValue * 0.72, date: "2024-12-15" },
    { value: currentStats.totalValue * 0.79, date: "2025-01-01" },
    { value: currentStats.totalValue * 0.76, date: "2025-01-15" },
    { value: currentStats.totalValue * 0.82, date: "2025-02-01" },
    { value: currentStats.totalValue * 0.85, date: "2025-02-15" },
    { value: currentStats.totalValue * 0.8, date: "2025-03-01" },
    { value: currentStats.totalValue * 0.87, date: "2025-03-15" },
    { value: currentStats.totalValue * 0.81, date: "2025-04-01" },
    { value: currentStats.totalValue * 0.86, date: "2025-04-15" },
    { value: currentStats.totalValue, date: "2025-05-01" },
  ];

  const completedCountChartData = [
    { value: Math.round(currentStats.completedCount * 0.65), date: "2024-10-01" },
    { value: Math.round(currentStats.completedCount * 0.71), date: "2024-10-15" },
    { value: Math.round(currentStats.completedCount * 0.68), date: "2024-11-01" },
    { value: Math.round(currentStats.completedCount * 0.77), date: "2024-11-15" },
    { value: Math.round(currentStats.completedCount * 0.84), date: "2024-12-01" },
    { value: Math.round(currentStats.completedCount * 0.74), date: "2024-12-15" },
    { value: Math.round(currentStats.completedCount * 0.87), date: "2025-01-01" },
    { value: Math.round(currentStats.completedCount * 0.94), date: "2025-01-15" },
    { value: Math.round(currentStats.completedCount * 0.84), date: "2025-02-01" },
    { value: Math.round(currentStats.completedCount * 0.97), date: "2025-02-15" },
    { value: Math.round(currentStats.completedCount * 1.03), date: "2025-03-01" },
    { value: Math.round(currentStats.completedCount * 1.0), date: "2025-03-15" },
    { value: Math.round(currentStats.completedCount * 1.1), date: "2025-04-01" },
    { value: Math.round(currentStats.completedCount * 0.97), date: "2025-04-15" },
    { value: currentStats.completedCount, date: "2025-05-01" },
  ];

  const pendingCountChartData = [
    { value: Math.round(currentStats.pendingCount * 2.0), date: "2024-10-01" },
    { value: Math.round(currentStats.pendingCount * 1.5), date: "2024-10-15" },
    { value: Math.round(currentStats.pendingCount * 2.25), date: "2024-11-01" },
    { value: Math.round(currentStats.pendingCount * 1.25), date: "2024-11-15" },
    { value: Math.round(currentStats.pendingCount * 1.75), date: "2024-12-01" },
    { value: Math.round(currentStats.pendingCount * 1.5), date: "2024-12-15" },
    { value: Math.round(currentStats.pendingCount * 1.0), date: "2025-01-01" },
    { value: Math.round(currentStats.pendingCount * 1.25), date: "2025-01-15" },
    { value: Math.round(currentStats.pendingCount * 1.5), date: "2025-02-01" },
    { value: Math.round(currentStats.pendingCount * 0.75), date: "2025-02-15" },
    { value: Math.round(currentStats.pendingCount * 1.25), date: "2025-03-01" },
    { value: Math.round(currentStats.pendingCount * 1.0), date: "2025-03-15" },
    { value: Math.round(currentStats.pendingCount * 1.5), date: "2025-04-01" },
    { value: Math.round(currentStats.pendingCount * 1.25), date: "2025-04-15" },
    { value: currentStats.pendingCount, date: "2025-05-01" },
  ];

  const rejectedValueChartData = [
    { value: currentStats.rejectedValue * 0.62, date: "2024-10-01" },
    { value: currentStats.rejectedValue * 0.69, date: "2024-10-15" },
    { value: currentStats.rejectedValue * 0.65, date: "2024-11-01" },
    { value: currentStats.rejectedValue * 0.77, date: "2024-11-15" },
    { value: currentStats.rejectedValue * 0.85, date: "2024-12-01" },
    { value: currentStats.rejectedValue * 0.73, date: "2024-12-15" },
    { value: currentStats.rejectedValue * 0.96, date: "2025-01-01" },
    { value: currentStats.rejectedValue * 0.88, date: "2025-01-15" },
    { value: currentStats.rejectedValue * 1.0, date: "2025-02-01" },
    { value: currentStats.rejectedValue * 1.08, date: "2025-02-15" },
    { value: currentStats.rejectedValue * 0.98, date: "2025-03-01" },
    { value: currentStats.rejectedValue * 1.04, date: "2025-03-15" },
    { value: currentStats.rejectedValue * 0.91, date: "2025-04-01" },
    { value: currentStats.rejectedValue * 0.96, date: "2025-04-15" },
    { value: currentStats.rejectedValue, date: "2025-05-01" },
  ];

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <StatCard
        icon={TrendingUp}
        title="Total Faturado"
        value={invoicingData?.totalAmountWithFeesGateway ?? 0}
        chartData={totalValueChartData}
        chartColor="142, 76%, 36%"
        formatValue={formatCurrency}
      />

      <StatCard
        icon={CheckCircle2}
        title="Transações Finalizadas"
        value={invoicingData?.totalFinishedPayments ?? 0}
        chartData={completedCountChartData}
        chartColor="142, 76%, 36%"
      />

      <StatCard
        icon={Clock}
        title="Transações Pendentes"
        value={invoicingData?.totalPendingPayments ?? 0}
        chartData={pendingCountChartData}
        chartColor="45, 93%, 47%"
      />

      <StatCard
        icon={XCircle}
        title="Valor Recusado"
        value={invoicingData?.totalAmountCancelled ?? 0}
        chartData={rejectedValueChartData}
        chartColor="0, 72%, 51%"
        formatValue={formatCurrency}
      />
    </div>
  );
}
