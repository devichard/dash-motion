"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import type { DailySalesCount } from "@/types/payments";
import { adminService } from "@/lib/api/admin-service";
import { toast } from "sonner";

export const description = "A bar chart with a label";

const chartConfig = {
  salles: {
    label: "Vendas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type Props = {
  startDate: string;
  endDate: string;
};

export function ChartBarLabel({ startDate, endDate }: Props) {
  const [chartData, setChartData] = useState<DailySalesCount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await adminService.getDashboardDailySalesCountData("month", startDate, endDate);
        if (response.success) {
          setChartData(response.data);
          console.log(response.data);
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
    <Card className="h-full">
      <CardHeader className="flex items-center border-b sm:flex-row">
        <div>
          <CardTitle className="text-base font-medium">Vendas finalizadas por dia</CardTitle>
          <CardDescription className="text-xs">Acompanhe o número de vendas finalizadas por dia</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="count" fill="var(--color-salles)" radius={8}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
