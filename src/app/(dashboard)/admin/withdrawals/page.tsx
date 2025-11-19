"use client";

import { Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Table, { type AnticipationsItem } from "@/components/dashboard/pages/admin/withdrawals/table";
import WithdrawalStats from "@/components/dashboard/pages/admin/withdrawals/withdrawal-stats";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWithdrawalsReport, type WithdrawalsReportData } from "@/lib/export-excel";

export default function WithdrawalsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const tableDataRef = useRef<AnticipationsItem[]>([]);

  const handleDataChange = useCallback((data: AnticipationsItem[]) => {
    tableDataRef.current = data;
  }, []);

  const handleGenerateReport = () => {
    const filteredData = tableDataRef.current.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        item.enterprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cnpj.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });

    const reportData: WithdrawalsReportData[] = filteredData.map((item) => ({
      "ID do saque": item.uuid,
      Empresa: item.enterprise,
      CNPJ: item.cnpj,
      Valor: formatCurrency(item.value),
      Destino: item.bankAccount || "N/A",
      "Criado em": new Date(item.created).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      Status: item.status,
    }));

    generateWithdrawalsReport(reportData, "relatorio-saques");
  };

  return (
    <section className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-xl">Todos os Saques</h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe todas as solicitações de saque realizadas no seu Gateway
        </p>
      </div>

      <WithdrawalStats />
      <div className="flex w-full gap-2 sm:w-auto justify-between">
        <div className="flex w-full flex-col gap-2 sm:w-auto">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Filtro por Tipo</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full min-w-[150px] sm:w-[180px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Finalizado">Aprovado</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Recusado">Recusado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end justify-start sm:w-auto sm:justify-end">
          <div className="flex-1 min-w-60">
            <div className="flex w-full gap-2 sm:w-auto">
              <div className="relative mt-2 w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Busca por nome ou CNPJ"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="primary" className="w-full mt-2 sm:w-auto" onClick={handleGenerateReport}>
                Gerar Relatório
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Table statusFilter={statusFilter} searchQuery={searchQuery} onDataChange={handleDataChange} />
      </div>
    </section>
  );
}
