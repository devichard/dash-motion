"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/components/ui/data-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { paymentsService } from "@/lib/api/payments-service";
import type { Payment } from "@/types/payments";
import { PaymentMethod, PaymentStatus } from "@/types/payments";

interface TableOverviewSallerProps {
  onDataChange?: (data: Payment[]) => void;
}

const ITEMS_PER_PAGE = 9;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatPaymentMethod(method: PaymentMethod): "Pix" | "Boleto" | "Cartão" {
  switch (method) {
    case PaymentMethod.pix:
      return "Pix";
    default:
      return "Pix";
  }
}

function formatPaymentStatus(status: PaymentStatus): "Pendente" | "Aprovado" | "Recusado" {
  switch (status) {
    case PaymentStatus.finished:
      return "Aprovado";
    case PaymentStatus.peding:
    case PaymentStatus.created:
      return "Pendente";
    case PaymentStatus.cancelled:
      return "Recusado";
    default:
      return "Pendente";
  }
}

export default function TableOverviewSaller({ onDataChange }: TableOverviewSallerProps) {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await paymentsService.list(currentPage, ITEMS_PER_PAGE);

        if (response.success && response.data) {
          // Verificar se response.data é um array diretamente ou se tem propriedade data
          let rawData: Payment[] = [];

          if (Array.isArray(response.data)) {
            rawData = response.data;
          } else if (Array.isArray(response.data.data)) {
            rawData = response.data.data;
          } else if (
            response.data.data &&
            typeof response.data.data === "object" &&
            !Array.isArray(response.data.data)
          ) {
            // Se response.data.data é um objeto (pode ser array-like)
            rawData = Object.values(response.data.data).filter(
              (item: any) => item && typeof item === "object" && item.id,
            ) as Payment[];
          }

          // Garantir que totalPages e totalRecords sejam acessados corretamente
          // A API retorna PaymentResponse com estrutura: { data: [], totalPages, totalRecords, currentPage, perPage }
          const totalPagesValue =
            response.data &&
            typeof response.data === "object" &&
            "totalPages" in response.data &&
            typeof response.data.totalPages === "number"
              ? response.data.totalPages
              : 1;
          const totalRecordsValue =
            response.data &&
            typeof response.data === "object" &&
            "totalRecords" in response.data &&
            typeof response.data.totalRecords === "number"
              ? response.data.totalRecords
              : rawData.length;

          setData(rawData);
          setTotalPages(totalPagesValue);
          setTotalRecords(totalRecordsValue);

          if (onDataChange) {
            onDataChange(rawData);
          }
        } else {
          setData([]);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (_error) {
        setData([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage, onDataChange]);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  const startIndex = totalRecords === 0 ? 0 : Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalRecords);
  const endIndex = totalRecords === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  if (loading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-popover/30 h-12 rounded-xl">
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Cliente</TableHead>
              <TableHead>Pedido</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="px-4 text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <TableRow key={i.toString()} className="h-16">
                <TableCell colSpan={7} className="text-center">
                  <div className="animate-pulse">Carregando...</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader className="bg-popover/30 h-12 rounded-xl">
          <TableRow className="hover:bg-transparent">
            <TableHead className="px-4">Cliente</TableHead>
            <TableHead>Pedido</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Forma de Pagamento</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="px-4 text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                Nenhum pagamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((payment) => {
              const status = formatPaymentStatus(payment.status);
              const paymentMethod = formatPaymentMethod(payment.method);
              const customerName = payment.customerName || "Cliente";
              const customerEmail = payment.customerEmail || "";
              const order = payment.paymentLink?.description || "-";

              return (
                <TableRow key={payment.id} className="h-16">
                  <TableCell className="px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        className="rounded-full"
                        src="/img/logo-green-background.png"
                        width={40}
                        height={40}
                        alt={customerName}
                      />
                      <div>
                        <div className="font-medium">{customerName}</div>
                        <span className="text-muted-foreground mt-0.5 text-xs">{customerEmail}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order}</TableCell>
                  <TableCell>{formatCurrency(payment.amountWithAllFees)}</TableCell>
                  <TableCell>{paymentMethod}</TableCell>
                  <TableCell>{formatDateTime(new Date(payment.createdAt))}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className={`size-1.5 rounded-full ${
                          status === "Aprovado"
                            ? "bg-green-500"
                            : status === "Pendente"
                              ? "bg-yellow-500"
                              : status === "Recusado"
                                ? "bg-red-500"
                                : "bg-gray-500"
                        }`}
                        aria-hidden="true"
                      ></span>
                      {status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 text-right">
                    <Link className="justify-end flex" href={`/`}>
                      <Eye className="text-muted-foreground hover:text-foreground size-5 mr-2" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {data && data.length > 0 && (
        <div className="flex items-center justify-between px-4 py-1 border-t">
          <div className="text-xs text-muted-foreground">
            {startIndex}-{endIndex} de {totalRecords}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
