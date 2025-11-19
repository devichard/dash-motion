"use client";

import type { LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";

interface StatCardProps {
  /**
   * Ícone a ser exibido no cabeçalho do card
   */
  icon: LucideIcon;
  /**
   * Título/descrição do card
   */
  title: string;
  /**
   * Valor principal a ser exibido
   */
  value: string | number;
  /**
   * Dados para o gráfico de área
   * Cada item deve ter a propriedade 'value' e opcionalmente 'date'
   */
  chartData: Array<{ value: number; date?: string }>;
  /**
   * Cor do gráfico em formato HSL
   * Exemplo: "142, 76%, 36%" para verde
   */
  chartColor: string;
  /**
   * Função opcional para formatar o valor exibido
   * Se não fornecida, o valor será exibido como string
   */
  formatValue?: (value: string | number) => string;
  /**
   * Classe CSS adicional para o card
   */
  className?: string;
}

export function StatCard({
  icon: Icon,
  title,
  value,
  chartData,
  chartColor,
  formatValue,
  className = "",
}: StatCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(value.toString().replace(/[^0-9.-]/g, ""));
  const gradientId = `gradient-${title.replace(/\s+/g, "-").toLowerCase()}`;

  const isCurrency = formatValue !== undefined;

  const prefix = !formatValue && typeof value === "string" ? value.match(/^[^0-9.-]*/)?.[0] || "" : "";
  const suffix = !formatValue && typeof value === "string" ? value.match(/[^0-9.-]*$/)?.[0] || "" : "";

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardContent className="!p-0 !pt-6 !px-6 !py-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Icon className="size-4" />
          {title}
        </div>
        <div className="text-3xl font-medium">
          {!isCurrency && prefix}
          <NumberTicker
            value={Number.isNaN(numericValue) ? 0 : numericValue}
            variant={isCurrency ? "currency" : "default"}
            decimalPlaces={isCurrency ? 2 : 0}
            className="inline-block"
          />
          {!isCurrency && suffix}
        </div>
        <div className="h-20 -mx-6 -mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`hsl(${chartColor})`} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={`hsl(${chartColor})`} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={`hsl(${chartColor})`}
                fill={`url(#${gradientId})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
