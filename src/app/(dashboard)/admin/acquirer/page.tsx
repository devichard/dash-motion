import Table from "@/components/dashboard/pages/admin/acquirer/table";

export default function AcquirerPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Faturamento por Adquirente</h1>
          <p className="text-muted-foreground text-sm">Acompanhe o volume processado das adquirentes</p>
        </div>
      </div>

      <div className="py-6">
        <Table />
      </div>
    </div>
  );
}
