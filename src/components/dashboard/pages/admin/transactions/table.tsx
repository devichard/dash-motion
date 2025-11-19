"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { type Column, DataTable, formatCurrency, formatDateTime } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminService } from "@/lib/api/admin-service";
import type { AdminPaymentData } from "@/types/payments";
import { PaymentStatus } from "@/types/payments";

interface TableTransactionsProps {
  statusFilter: string;
  searchQuery: string;
  onDataChange?: (data: AdminPaymentData[]) => void;
}

export interface TransactionItem extends Omit<AdminPaymentData, "status"> {
  uuid: string;
  status: "Pendente" | "Pago" | "Cancelado" | "Estornado";
}

export function adaptTransaction(t: AdminPaymentData): TransactionItem {
  return {
    ...t,
    uuid: t.id,
    status:
      t.status === PaymentStatus.finished
        ? "Pago"
        : t.status === PaymentStatus.peding
          ? "Pendente"
          : t.status === PaymentStatus.cancelled
            ? "Cancelado"
            : "Estornado",
  };
}

export default function TableTransactions({ statusFilter, searchQuery }: TableTransactionsProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await adminService.getPayments();

        if (response.success) {
          const raw = Array.isArray(response.data) ? response.data : (response.data.data ?? []);
          const mapped = raw.map(adaptTransaction);
          setTransactions(mapped);
        } else {
          toast.error("Erro ao carregar transações");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar transações");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleRowClick = (transaction: TransactionItem) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const columns: Column<TransactionItem>[] = [
    {
      header: "Cliente",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <Image src="/img/logo-green-background.png" width={40} height={40} alt="Logo" />
          <div>
            <div className="font-medium">{item.customerName}</div>
            <span className="text-muted-foreground mt-0.5 text-xs">{item.customerEmail}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Produto",
      accessor: (item) => item.paymentLink?.description ?? "Produto padrão",
    },
    {
      header: "Valor Bruto",
      accessor: (item) => formatCurrency(item.amount),
    },
    {
      header: "Valor Líquido",
      accessor: (item) => formatCurrency(item.amountWithAllFees),
    },
    {
      header: "Método",
      accessor: (item) => item.method.toUpperCase(),
    },
    {
      header: "Status",
      accessor: (item) => (
        <Badge variant="outline">
          <span
            className={`size-1.5 rounded-full ${
              item.status === "Pago"
                ? "bg-green-500"
                : item.status === "Pendente"
                  ? "bg-yellow-500"
                  : item.status === "Cancelado"
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
      header: "Criado em",
      accessor: (item) => formatDateTime(new Date(item.createdAt)),
    },
  ];

  const filterFunction = (item: TransactionItem) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    const name = item.customerName?.toLowerCase() ?? "";
    const email = item.customerEmail?.toLowerCase() ?? "";

    const matchesSearch =
      searchQuery === "" || name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  };

  const sortFunction = (a: TransactionItem, b: TransactionItem) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      <DataTable
        data={transactions}
        columns={columns}
        itemsPerPage={9}
        emptyMessage="Nenhuma solicitação encontrada"
        onFilter={filterFunction}
        onSort={sortFunction}
        onRowClick={handleRowClick}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes da Transação</DialogTitle>
            <DialogDescription>ID: {selectedTransaction?.id}</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">ID</p>
                  <p className="text-sm font-medium">{selectedTransaction.id}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Produto</p>
                  <p className="text-sm font-medium">{selectedTransaction.paymentLink?.description ?? "-"}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Forma de Pagamento</p>
                  <p className="text-sm font-medium">{selectedTransaction.method.toUpperCase()}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Criado Em</p>
                  <p className="text-sm font-medium">{formatDateTime(new Date(selectedTransaction.createdAt))}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valor Total</p>
                  <p className="text-sm font-medium">{formatCurrency(selectedTransaction.amountWithAllFees)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Valor com Taxas</p>
                  <p className="text-sm font-medium">{formatCurrency(selectedTransaction.amountWithFeesGateway)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="text-sm font-medium">{selectedTransaction.status}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Confirmado em</p>
                  <p className="text-sm font-medium">
                    {selectedTransaction.confirmedAt ? formatDateTime(new Date(selectedTransaction.confirmedAt)) : "-"}
                  </p>
                </div>
              </div>

              <div className="border-b h-0.5"></div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cliente</p>
                  <p className="text-sm font-medium">{selectedTransaction.customerName}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium">{selectedTransaction.customerEmail}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
