"use client";

import { useState } from "react";
import type { DateValue } from "react-aria-components";
import InvoicingStats from "@/components/dashboard/pages/admin/invoicing/invoicing-stats";
import Table from "@/components/dashboard/pages/admin/invoicing/table";
import DatePicker from "@/components/ui/date-picker";

export default function InvoicingPage() {
  const [dateRange, setDateRange] = useState<{ start: DateValue; end: DateValue } | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Faturamento por período</h1>
          <p className="text-muted-foreground text-sm">
            Acompanhe o faturamento das empresas em um determinado período
          </p>
        </div>
        <DatePicker value={dateRange} onChange={setDateRange} />
      </div>

      <div className="py-6">
        <InvoicingStats />
      </div>

      <Table />
    </div>
  );
}
