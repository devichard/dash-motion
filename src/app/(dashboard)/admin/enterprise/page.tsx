"use client";

import { Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Table, { type EnterpriseItem } from "@/components/dashboard/pages/admin/enterprise/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type ExcelReportData, generateEnterpriseReport } from "@/lib/export-excel";

export default function EnterprisePage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const tableDataRef = useRef<EnterpriseItem[]>([]);

  const handleDataChange = useCallback((data: EnterpriseItem[]) => {
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

    const reportData: ExcelReportData[] = filteredData.map((item) => ({
      "ID da empresa": item.uuid,
      "Razão Social": item.enterprise,
      CNPJ: item.cnpj,
      Telefone: item.phone,
      "E-mail": item.email,
      "Total em vendas": formatCurrency(item.sales),
      "Saldo da empresa": formatCurrency(item.balance),
      Status: item.status,
      "Data de criação": new Date(item.created).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    generateEnterpriseReport(reportData, "relatorio-empresas");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Todas as Empresas</h1>
          <p className="text-muted-foreground text-sm">Veja a lista de todas as empresas do seu gateway</p>
        </div>
        <div className="flex w-1/2 justify-end items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Ativos">Ativos</SelectItem>
              <SelectItem value="Inativos">Inativos</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou cnpj"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="primary" onClick={handleGenerateReport}>
            Gerar Relatório
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <Table statusFilter={statusFilter} searchQuery={searchQuery} onDataChange={handleDataChange} />
      </div>
    </div>
  );
}
