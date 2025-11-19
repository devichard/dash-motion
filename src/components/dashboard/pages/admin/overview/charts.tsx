"use client";

import { BadgeDollarSign, CheckCircle2, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { adminService } from "@/lib/api/admin-service";
import type { AdminDashboardDataResponse } from "@/types/dashboard";
import { ChartAreaInteractive } from "./charts/chart-area-interactive";
import { ChartBarLabel } from "./charts/chart-bar-label";
import DemographicCard from "./charts/DemographicCard";
import type { DateValue } from "react-aria-components";

type ChartsProps = {
  dateRange: { start: DateValue; end: DateValue } | null;
};

export default function Charts({ dateRange }: ChartsProps) {
  const [overviewData, setOverviewData] = useState<AdminDashboardDataResponse>();
  const [loading, setLoading] = useState(true);

  function toISODateOnly(date: DateValue) {
    return new Date(date.year, date.month - 1, date.day).toISOString().split("T")[0];
  }

  function getDefaultRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return {
      start: start.toISOString().split("T")[0],
      end: now.toISOString().split("T")[0],
    };
  }

  const hasRange = dateRange?.start && dateRange?.end;
  const { start, end } = hasRange
    ? {
        start: toISODateOnly(dateRange.start),
        end: toISODateOnly(dateRange.end),
      }
    : getDefaultRange();

  useEffect(() => {
    const getOverviewData = async () => {
      try {
        const response = await adminService.getDashboardOverviewData();
        if (response.success) {
          setOverviewData(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getOverviewData();
  }, []);

  if (loading) return <p>Carregando informações...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
      <div className="lg:col-span-5">
        <ChartAreaInteractive startDate={start} endDate={end} />
      </div>
      <div className="lg:col-span-3">
        <DemographicCard />
      </div>

      <div className="lg:col-span-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <BadgeDollarSign className="size-4" />
                Total em Vendas
              </CardDescription>
              <CardTitle className="text-3xl font-medium">
                <NumberTicker value={overviewData?.totalRevenue ?? 0} variant="currency" decimalPlaces={2} delay={0.2} />
              </CardTitle>

              {/* <div>
                <h1 className="text-primary flex flex-row font-medium items-center gap-2">
                  <NumberTicker value={32.8} variant="percent" decimalPlaces={1} showSign={true} />
                  <TrendingUp className="size-4" />
                </h1>
                <div className="text-muted-foreground text-xs">Durante o periodo escolhido</div>
              </div> */}
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <Users className="size-4" />
                Ticket Médio
              </CardDescription>
              <CardTitle className="text-3xl font-medium">
                <NumberTicker value={overviewData?.averageTicket ?? 0} variant="currency" decimalPlaces={2} delay={0.4} />
              </CardTitle>

              {/* <div>
                <h1 className="text-muted-foreground flex flex-row font-medium items-center gap-2">
                  <NumberTicker value={0} variant="percent" decimalPlaces={1} showSign />
                  <TrendingUpDown className="size-4" />
                </h1>
                <div className="text-muted-foreground text-xs">Em 831 vendas</div>
              </div> */}
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Pedidos Pagos
              </CardDescription>
              <CardTitle className="text-3xl font-medium">
                <NumberTicker value={overviewData?.qtdPaidOrders ?? 0} delay={0.6} />
              </CardTitle>

              {/* <div>
                <h1 className="text-primary flex flex-row font-medium items-center gap-2">
                  <NumberTicker value={0.4} variant="percent" decimalPlaces={1} showSign={true} />
                  <TrendingUp className="size-4" />
                </h1>
                <div className="text-muted-foreground text-xs">Durante o periodo escolhido</div>
              </div> */}
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="size-4" />
                Reembolsos no Período
              </CardDescription>
              <CardTitle className="text-3xl font-medium">
                <NumberTicker value={overviewData?.qtdRefunds ?? 0} delay={0.8} />
              </CardTitle>

              {/* <div>
                <h1 className="text-destructive flex flex-row font-medium items-center gap-2">
                  <NumberTicker value={-3.8} variant="percent" decimalPlaces={1} showSign />
                  <TrendingDown className="size-4" />
                </h1>
                <div className="text-muted-foreground text-xs">Durante o periodo escolhido</div>
              </div> */}
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="lg:col-span-4">
        <ChartBarLabel startDate={start} endDate={end} />
      </div>
    </div>
  );
}
