"use client";

import Charts from "@/components/dashboard/pages/admin/overview/charts";
import DatePicker from "@/components/ui/date-picker";
import { useState } from "react";
import type { DateValue } from "react-aria-components";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue } | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Visão Geral</h1>
          <p className="text-muted-foreground text-sm">Veja o resumo do desempenho de seu gateway</p>
        </div>
        <DatePicker value={dateRange} onChange={setDateRange} />
      </div>
      <div className="mt-6">
        <Charts dateRange={dateRange} />
      </div>
    </div>
  );
}
