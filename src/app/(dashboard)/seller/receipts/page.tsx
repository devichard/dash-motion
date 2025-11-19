"use client";

import Receipts from "@/components/dashboard/pages/seller/receipts/receipts";

export default function OverviewSeller() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Recebimentos</h1>
          <p className="text-muted-foreground text-sm">Acompanhe suas taxas, saldos e solicite saques e antecipações</p>
        </div>
      </div>
      <div className="mt-6">
        <Receipts />
      </div>
    </div>
  );
}
