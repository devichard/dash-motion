import Charts from "@/components/dashboard/pages/seller/overview/charts";

export default function OverviewSeller() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Visão Geral</h1>
          <p className="text-muted-foreground text-sm">Acompanhe o resumo de sua Empresa!</p>
        </div>
      </div>
      <div className="mt-6">
        <Charts />
      </div>
    </div>
  );
}
