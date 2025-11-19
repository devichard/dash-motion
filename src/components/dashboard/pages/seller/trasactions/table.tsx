"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { type Column, DataTable, formatCurrency, formatDateTime } from "@/components/ui/data-table";
import { paymentsService } from "@/lib/api/payments-service";
import type { Payment } from "@/types/payments";

export interface TransactionItem {
  uuid: string;
  customer: string;
  email: string;
  paymentMethod: string;
  amount: number;
  amountWithGatewayFees: number;
  status: "aprovado" | "pendente" | "recusado";
  product: string;
  created: Date;
}

interface TableTransactionProps {
  statusFilter?: string;
  searchQuery?: string;
}

const statusMap: Record<string, TransactionItem["status"]> = {
  FINISHED: "aprovado",
  CANCELLED: "recusado",
  PENDING: "pendente",
  CREATED: "pendente",
};

export default function TableTransaction({ statusFilter = "all", searchQuery = "" }: TableTransactionProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MODO DEMO: Lista vazia - não carrega dados reais
    setPayments([]);
    setLoading(false);
  }, []);

  const transactions = useMemo<TransactionItem[]>(() => {
    return payments.map((p) => ({
      uuid: p.id,
      customer: p.customerName ?? "Cliente desconhecido",
      email: p.customerEmail ?? "Email não informado",
      paymentMethod: p.method.toUpperCase(),
      amount: p.amount,
      amountWithGatewayFees: p.amountWithFeesGateway,
      status: statusMap[p.status] ?? "pendente",
      product: p.paymentLink?.description ?? "Pagamento direto",
      created: new Date(p.confirmedAt ?? p.createdAt),
    }));
  }, [payments]);

  const filtered = useMemo(() => {
    return transactions
      .filter((item) => {
        const matchStatus = statusFilter === "all" || item.status === statusFilter;
        const matchSearch =
          searchQuery === "" ||
          item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchSearch;
      })
      .sort((a, b) => b.created.getTime() - a.created.getTime());
  }, [transactions, statusFilter, searchQuery]);

  if (loading) return <div className="text-center text-muted-foreground">Carregando pagamentos...</div>;

  const columns: Column<TransactionItem>[] = [
    {
      header: "Cliente",
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.customer}</span>
          <span className="text-xs text-muted-foreground">{item.email}</span>
        </div>
      ),
    },
    {
      header: "Forma de Pagamento",
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.paymentMethod}</span>
          <span className="text-xs text-muted-foreground">{formatCurrency(item.amountWithGatewayFees)}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (item) => (
        <Badge variant="secondary" className={`capitalize font-medium `}>
          <span
            className={`size-1.5 rounded-full ${
              item.status === "aprovado"
                ? "bg-green-500"
                : item.status === "pendente"
                  ? "bg-yellow-500"
                  : item.status === "recusado"
                    ? "bg-red-500"
                    : "bg-gray-500"
            }`}
            aria-hidden="true"
          ></span>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Produto",
      accessor: (item) => (
        <div className="flex flex-col">
          <span>{item.product}</span>
          <span className="text-xs text-muted-foreground">{formatCurrency(item.amount)}</span>
        </div>
      ),
    },
    {
      header: "Criado/Pago em",
      accessor: (item) => (
        <div className="flex flex-col">
          <span>{formatDateTime(item.created)}</span>
          <span className="text-xs text-green-600">Pago em {formatDateTime(item.created)}</span>
        </div>
      ),
    },
  ];

  return <DataTable data={filtered} columns={columns} itemsPerPage={9} emptyMessage="Nenhuma transação encontrada" />;
}
