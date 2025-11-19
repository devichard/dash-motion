"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { adminService } from "@/lib/api/admin-service";
import { toast } from "sonner";
import type { DailySalesValues } from "@/types/payments";

export const description = "An interactive area chart";

const chartConfig = {
  finished: {
    label: "Aprovadas: ",
    color: "var(--chart-2)",
  },
  pending: {
    label: "Pendentes: ",
    color: "var(--chart-3)",
  },
  cancelled: {
    label: "Canceladas: ",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  startDate: string;
  endDate: string;
};

export function ChartAreaInteractive({ startDate, endDate }: Props) {
  const [chartData, setChartData] = React.useState<DailySalesValues[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await adminService.getDashboardDailySalesValuesData("month", startDate, endDate);
        if (response.success) {
          setChartData(response.data);
        } else {
          toast.error("Erro ao carregar dados do gráfico");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar dados do gráfico");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [endDate, startDate]);

  if (loading) return <p>Carregando dados...</p>;

  return (
    <Card className=" flex flex-col">
      <CardHeader className="flex items-center border-b sm:flex-row">
        <div>
          <CardTitle className="text-base font-medium">Vendas Diárias</CardTitle>
          <CardDescription className="text-xs">Acompanhe o volume diário do seu gateway</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-2 pb-2 sm:px-6 sm:pt-4">
        <div>
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillFinished" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-finished)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-finished)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pending)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-pending)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillCancelled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-cancelled)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-cancelled)" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
                }}
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })
                    }
                    formatter={(value, name) => {
                      const label = chartConfig[name as keyof typeof chartConfig]?.label || name;
                      return [label, new Intl.NumberFormat("pt-BR", { style: "decimal" }).format(value as number)];
                    }}
                    indicator="dot"
                  />
                }
              />

              <Area
                dataKey="finished"
                type="natural"
                fill="url(#fillFinished)"
                stroke="var(--color-finished)"
                stackId="a"
              />
              <Area
                dataKey="pending"
                type="natural"
                fill="url(#fillPending)"
                stroke="var(--color-pending)"
                stackId="a"
              />
              <Area
                dataKey="cancelled"
                type="natural"
                fill="url(#fillCancelled)"
                stroke="var(--color-cancelled)"
                stackId="a"
              />

              <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
