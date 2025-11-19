"use client";

import { Search } from "lucide-react";
import { useRef, useState } from "react";
import Table, { type TransactionItem } from "@/components/dashboard/pages/admin/transactions/table";
import TransactionStats from "@/components/dashboard/pages/admin/transactions/transaction-stats";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateTransactionsReport, type TransactionsReportData } from "@/lib/export-excel";

export default function TransactionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const tableDataRef = useRef<TransactionItem[]>([]);

  const handleGenerateReport = () => {
    const filteredData = tableDataRef.current.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesSearch =
        searchQuery === "" ||
        item.customer.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer.enterprises[0].cnpj.includes(searchQuery);
      return matchesStatus && matchesSearch;
    });

    const reportData: TransactionsReportData[] = filteredData.map((item) => ({
      "ID da transação": item.uuid,
      Empresa: item.customer.companyName,
      CNPJ: item.customer.enterprises[0].cnpj,
      Produto: item.paymentLink?.description ?? "",
      "Valor Total": formatCurrency(item.amountWithFeesGateway),
      "Valor do Produto": formatCurrency(item.amountWithAllFees),
      Quantidade: item.amount,
      "Forma de Pagamento": item.method,
      "Criado em": new Date(item.createdAt).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      Status: item.status,
    }));

    generateTransactionsReport(reportData, "relatorio-transacoes");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Todas as Transações</h1>
          <p className="text-muted-foreground text-sm">Acompanhe todas as vendas realizadas no seu Gateway</p>
        </div>
        <div className="flex w-1/2 justify-end items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Pago">Pago</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Recusado">Recusado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
              <SelectItem value="Expirado">Expirado</SelectItem>
              <SelectItem value="Estornado">Estornado</SelectItem>
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

      <div className="py-6">
        <TransactionStats />
      </div>

      <Table
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        // onDataChange={(data) => {
        //   tableDataRef.current = data.map((item) => ({
        //     ...item,
        //     uuid: item.id,
        //   }));
        // }}
      />
    </div>
  );
}
