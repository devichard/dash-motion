"use client";

import Charts from "@/components/dashboard/pages/seller/overview/charts";
import DatePicker from "@/components/ui/date-picker";
import { useState } from "react";
import type { DateValue } from "react-aria-components";

export default function OverviewSeller() {
  const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue } | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Visão Geral</h1>
          <p className="text-muted-foreground text-sm">Acompanhe o resumo de sua Empresa!</p>
        </div>
        <DatePicker value={dateRange} onChange={setDateRange} />
      </div>
      <div className="mt-6">
        <Charts />
      </div>
    </div>
  );
}
