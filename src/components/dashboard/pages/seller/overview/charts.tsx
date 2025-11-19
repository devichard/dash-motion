"use client";

import { BadgeDollarSign, CheckCircle2, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Table from "@/components/dashboard/pages/seller/overview/charts/table";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { dashboardService } from "@/lib/api/dashboard-service";
import type { SellerDashboardDataResponse } from "@/types/dashboard";
import { ChartAreaInteractive } from "./charts/chart-area-interactive";
import DemographicCard from "./charts/DemographicCard";

export default function Charts() {
  const [data, setData] = useState<SellerDashboardDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await dashboardService.getDashboardOverviewData();

        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError("Não foi possível carregar os dados do dashboard");
        }
      } catch (_error) {
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i.toString()}>
                <CardHeader>
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-32 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Erro ao carregar dados</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <BadgeDollarSign className="size-4" />
                Total em Vendas
              </CardDescription>
              <CardTitle className="text-3xl font-medium">
                <NumberTicker value={data?.totalRevenue ?? 0} variant="currency" decimalPlaces={2} delay={0.2} />
              </CardTitle>

              <div>
                <div className="text-muted-foreground text-xs">Durante o periodo escolhido</div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <Users className="size-4" />
                Ticket Médio
              </CardDescription>
              <CardTitle className="text-3xl font-medium">
                <NumberTicker value={data?.averageTicket ?? 0} variant="currency" decimalPlaces={2} delay={0.4} />
              </CardTitle>

              <div>
                <div className="text-muted-foreground text-xs">Em {data?.qtdPaidOrders ?? 0} vendas</div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Pedidos Pagos
              </CardDescription>
              <CardTitle className="text-3xl font-medium">
                <NumberTicker value={data?.qtdPaidOrders ?? 0} delay={0.6} />
              </CardTitle>

              <div>
                <div className="text-muted-foreground text-xs">Durante o periodo escolhido</div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="size-4" />
                Reembolsos no Período
              </CardDescription>
              <CardTitle className="text-3xl font-medium">
                <NumberTicker value={data?.qtdRefunds ?? 0} delay={0.8} />
              </CardTitle>

              <div>
                <div className="text-muted-foreground text-xs">Durante o periodo escolhido</div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
      <div className="lg:col-span-3">
        <ChartAreaInteractive />
      </div>
      <div className="lg:col-span-1">
        <DemographicCard />
      </div>

      <div className="lg:col-span-4">
        <Table />
      </div>
    </div>
  );
}
