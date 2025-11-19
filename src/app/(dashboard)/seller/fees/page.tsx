"use client";

import Fees from "@/components/dashboard/pages/seller/fees/fees";

export default function OverviewSeller() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Taxas</h1>
          <p className="text-muted-foreground text-sm">Veja detalhadamente as taxas da plataforma</p>
        </div>
      </div>
      <div className="mt-6">
        <Fees />
      </div>
    </div>
  );
}
