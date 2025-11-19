"use client";

import { BadgeDollarSign, CheckCircle2, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { StatCard } from "@/components/ui/stat-card";

const stats = {
  totalValue: 13000,
  averageTicket: 290,
  paidCount: 53,
  pendingCount: 8,
};

interface RankingStatsProps {
  totalVolume: number;
  totalTransactions: number;
  averageTicket: number;
  topSellerName: string;
  topSellerValue: number;
}

export default function RankingStats({
  totalVolume,
  totalTransactions,
  averageTicket,
  topSellerName,
  topSellerValue,
}: RankingStatsProps) {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Trophy className="size-4 text-yellow-400" />
            <span className=" text-yellow-400">Top Seller</span>
          </div>
          {topSellerName}
          <div className="text-3xl font-medium">
            <NumberTicker value={topSellerValue} variant="currency" decimalPlaces={2} className="inline-block" />
          </div>
        </CardContent>
      </Card>
      <StatCard
        icon={BadgeDollarSign}
        title="Transações"
        value={totalTransactions}
        chartData={totalValueChartData}
        chartColor="142, 76%, 36%"
      />

      <StatCard
        icon={BadgeDollarSign}
        title="Volume"
        value={totalVolume}
        chartData={averageTicketChartData}
        chartColor="217, 91%, 60%"
        formatValue={formatCurrency}
      />

      <StatCard
        icon={CheckCircle2}
        title="Ticket médio"
        value={averageTicket}
        chartData={paidCountChartData}
        chartColor="142, 76%, 36%"
        formatValue={formatCurrency}
      />
    </div>
  );
}
