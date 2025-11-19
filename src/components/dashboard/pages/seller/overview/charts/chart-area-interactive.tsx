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

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", cart: 1245.5, ticket: 3200.0, pix: 1890.75 },
  { date: "2024-04-02", cart: 1320.0, ticket: 3500.0, pix: 2304.9 },
  { date: "2024-04-03", cart: 1100.4, ticket: 2800.0, pix: 1989.9 },
  { date: "2024-04-04", cart: 1255.2, ticket: 3100.0, pix: 2047.5 },
  { date: "2024-04-05", cart: 1420.9, ticket: 3650.0, pix: 2739.7 },
  { date: "2024-04-06", cart: 1004.3, ticket: 2550.0, pix: 1649.8 },
  { date: "2024-04-07", cart: 1550.2, ticket: 4000.0, pix: 2900.1 },
  { date: "2024-04-08", cart: 1200.7, ticket: 2950.0, pix: 1970.2 },
  { date: "2024-04-09", cart: 1380.5, ticket: 3400.0, pix: 2578.9 },
  { date: "2024-04-10", cart: 1455.3, ticket: 3600.0, pix: 2959.9 },
  { date: "2024-04-11", cart: 1280.2, ticket: 3200.0, pix: 2300.4 },
  { date: "2024-04-12", cart: 1600.4, ticket: 4100.0, pix: 3321.4 },
  { date: "2024-04-13", cart: 1010.5, ticket: 2600.0, pix: 1690.2 },
  { date: "2024-04-14", cart: 1405.7, ticket: 3500.0, pix: 2836.6 },
  { date: "2024-04-15", cart: 1300.9, ticket: 3100.0, pix: 2549.2 },
  { date: "2024-04-16", cart: 1220.0, ticket: 2900.0, pix: 2301.4 },
  { date: "2024-04-17", cart: 1500.3, ticket: 3700.0, pix: 2953.9 },
  { date: "2024-04-18", cart: 1089.4, ticket: 2650.0, pix: 2050.2 },
  { date: "2024-04-19", cart: 1350.5, ticket: 3300.0, pix: 2774.5 },
  { date: "2024-04-20", cart: 1580.2, ticket: 4000.0, pix: 3309.6 },
  { date: "2024-04-21", cart: 980.6, ticket: 2400.0, pix: 1641.1 },
  { date: "2024-04-22", cart: 1420.0, ticket: 3550.0, pix: 2935.3 },
  { date: "2024-04-23", cart: 1185.9, ticket: 2800.0, pix: 2138.9 },
  { date: "2024-04-24", cart: 1330.4, ticket: 3400.0, pix: 2601.9 },
  { date: "2024-04-25", cart: 1509.1, ticket: 3850.0, pix: 3201.8 },
];

const chartConfig = {
  atividade: {
    label: "Atividade",
  },
  cart: {
    label: "Cartão: ",
    color: "var(--chart-2)",
  },
  pix: {
    label: "Pix: ",
    color: "var(--chart-3)",
  },
  ticket: {
    label: "Boleto: ",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const [timeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex items-center border-b sm:flex-row">
        <div>
          <CardTitle className="text-base font-medium">Vendas Diárias</CardTitle>
          <CardDescription className="text-xs">Acompanhe o volume diário do seu gateway</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-2 pb-2 sm:px-6 sm:pt-4">
        <div>
          <ChartContainer config={chartConfig} className="w-full h-[300px]">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillCart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-cart)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-cart)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillTicket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-ticket)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-ticket)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillPix" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-pix)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-pix)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("pt-BR", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    formatter={(value, name) => {
                      const label = chartConfig[name as keyof typeof chartConfig]?.label || name;
                      return [
                        label,
                        new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(value as number),
                      ];
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area dataKey="cart" type="natural" fill="url(#fillCart)" stroke="var(--color-cart)" stackId="a" />
              <Area dataKey="pix" type="natural" fill="url(#fillPix)" stroke="var(--color-pix)" stackId="a" />
              <Area dataKey="ticket" type="natural" fill="url(#fillTicket)" stroke="var(--color-ticket)" stackId="a" />
              <ChartLegend content={<ChartLegendContent payload={undefined} />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
