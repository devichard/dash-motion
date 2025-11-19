"use client";

import { useEffect, useState } from "react";
import type { DateValue } from "react-aria-components";
import { toast } from "sonner";
import RankingStats from "@/components/dashboard/pages/admin/company-invoicing/ranking-stats";
import Table from "@/components/dashboard/pages/admin/company-invoicing/table";
import DatePicker from "@/components/ui/date-picker";
import { adminService } from "@/lib/api/admin-service";
import type { RobinHoodResponse } from "@/types/robin-hood";

export default function CompanyInvoicingPage() {
  const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue } | null>(null);
  const [rankingData, setRankingData] = useState<RobinHoodResponse>();

  function getLastMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = now;
    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  }
  function toISODateOnly(date: DateValue) {
    return new Date(date.year, date.month - 1, date.day).toISOString().split("T")[0];
  }

  const hasValidRange = dateRange?.start && dateRange?.end;

  const defaultRange = getLastMonthRange();

  const startDate = hasValidRange ? toISODateOnly(dateRange.start) : defaultRange.start;
  const endDate = hasValidRange ? toISODateOnly(dateRange.end) : defaultRange.end;

  useEffect(() => {
    const getRanking = async () => {
      try {
        const response = await adminService.getRanking(startDate, endDate);
        if (response.success) {
          setRankingData(response.data);
          console.log(response.data);
        } else {
          console.error("Erro ao buscar ranking:", response.errorMessage);
          toast.error("Erro ao buscar ranking");
        }
      } catch (error) {
        console.error(error);
      }
    };
    getRanking();
  }, [startDate, endDate]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Lucro por Empresa</h1>
          <p className="text-muted-foreground text-sm">Acompanhe o lucro individual de cada empresa</p>
        </div>
        <DatePicker value={dateRange} onChange={setDateRange} />
      </div>
      <div className="py-6">
        <RankingStats
          totalVolume={rankingData?.kpis.totalVolume ?? 0}
          totalTransactions={rankingData?.kpis.totalTransactions ?? 0}
          averageTicket={rankingData?.kpis.averageTicket ?? 0}
          topSellerName={rankingData?.kpis.topSeller.name ?? ""}
          topSellerValue={rankingData?.kpis.topSeller.value ?? 0}
        />
      </div>

      <div className="py-6">
        <Table data={rankingData?.ranking} />
      </div>
    </div>
  );
}
