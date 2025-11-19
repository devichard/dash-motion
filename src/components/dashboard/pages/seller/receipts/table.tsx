"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { type Column, DataTable, formatCurrency, formatDateTime } from "@/components/ui/data-table";
import { transactionsService } from "@/lib/api/transactions-service";
import type { FinancialTransaction, ReasonType } from "@/types/transactions";

export interface OverviewSallerItem {
  uuid: string;
  customer: string;
  type: "Pagamento" | "Saque" | "Taxa" | "Reserva financeira";
  value: number;
  created: Date;
  status: "Pendente" | "Aprovado" | "Recusado";
}

interface TableOverviewSallerProps {
  data?: OverviewSallerItem[];
  onDataChange?: (data: OverviewSallerItem[]) => void;
  statusFilter: string;
}

export default function TableOverviewSaller({ onDataChange, statusFilter }: TableOverviewSallerProps) {
  const [data, setData] = useState<OverviewSallerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const getCustomerLabel = useCallback((reason: ReasonType) => {
    switch (reason) {
      case "PAYMENT_RECEIVED":
        return "Venda recebida";
      case "SYSTEM_FEE":
        return "Taxa do sistema";
      case "RETENTION":
        return "Reserva automática";
      case "WITHDRAWAL":
        return "Saque solicitado";
      case "MANUAL_ADJUSTMENT":
        return "Ajuste manual";
      default:
        return "Movimentação";
    }
  }, []);

  const mapTransactionToOverviewItem = useCallback(
    (t: FinancialTransaction): OverviewSallerItem => {
      const typeMap: Record<ReasonType, OverviewSallerItem["type"]> = {
        PAYMENT_RECEIVED: "Pagamento",
        SYSTEM_FEE: "Taxa",
        RETENTION: "Reserva financeira",
        WITHDRAWAL: "Saque",
        MANUAL_ADJUSTMENT: "Pagamento",
      };

      return {
        uuid: t.id,
        customer: getCustomerLabel(t.reason),
        type: typeMap[t.reason],
        value: t.amount,
        created: new Date(t.createdAt),
        status: "Aprovado",
      };
    },
    [getCustomerLabel],
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await transactionsService.list();

        if (response.success) {
          console.log(response.data);
          const transactions = Array.isArray(response.data) ? response.data : response.data?.data || [];
          const mapped = transactions.filter((t) => t.isVisibleToSeller).map(mapTransactionToOverviewItem);

          setData(mapped);
          if (onDataChange) onDataChange(mapped);
        } else {
          console.error("Erro ao buscar transações:", response.errorMessage);
        }
      } catch (err) {
        console.error("Erro ao carregar transações:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [onDataChange, mapTransactionToOverviewItem]);

  const filterFunction = (item: OverviewSallerItem) => {
    return statusFilter === "all" || item.type === statusFilter;
  };

  const columns: Column<OverviewSallerItem>[] = [
    {
      header: "Descrição",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div>
            <div className="font-medium">{item.value > 0 ? `${item.customer}` : item.customer}</div>
          </div>
        </div>
      ),
      className: "px-4",
    },
    {
      header: "Tipo de movimentação",
      accessor: (item) => {
        const colorMap: Record<OverviewSallerItem["type"], string> = {
          Pagamento: "text-green-400 bg-green-500/10 border-green-500/50",
          Saque: "text-destructive bg-destructive/20 border-red-500/50",
          Taxa: "text-muted-foreground bg-gray-500/20 border-gray-500/50",
          "Reserva financeira": "text-yellow-600 bg-yellow-500/20 border-yellow-500/50",
        };
        return (
          <Badge
            className={`rounded-full border ${colorMap[item.type]} hover:none hover:bg-inherit hover:text-inherit`}
          >
            {item.type}
          </Badge>
        );
      },
    },
    {
      header: "Valor",
      accessor: (item) => (
        <span className={item.type === "Pagamento" ? "text-green-500" : "text-destructive"}>
          {item.type === "Pagamento" ? formatCurrency(item.value) : `- ${formatCurrency(item.value)}`}
        </span>
      ),
    },
    {
      header: "Data",
      accessor: (item) => formatDateTime(item.created),
    },
  ];

  const sortFunction = (a: OverviewSallerItem, b: OverviewSallerItem) => b.created.getTime() - a.created.getTime();

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando transações...</div>;
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      itemsPerPage={9}
      emptyMessage="Nenhuma transação encontrada"
      onSort={sortFunction}
      onFilter={filterFunction}
    />
  );
}
