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
import { PaymentMethod, PaymentStatus, PurchaserProvider } from "@/types/payments";

interface TableOverviewSallerProps {
  onDataChange?: (data: Payment[]) => void;
}

const ITEMS_PER_PAGE = 9;

  // Função para gerar dados mockados para demo
function generateMockData(): PaymentWithDisplayMethod[] {
  const now = new Date();
  const mockCustomers = [
    {
      name: "Ana Silva Santos",
      email: "ana.silva@email.com",
      product: "Curso de Marketing Digital",
      amount: 1297.0,
      method: PaymentMethod.pix,
      displayMethod: "Pix" as const,
      status: PaymentStatus.finished,
      daysAgo: 1,
      hoursAgo: 2,
      minutesAgo: 42,
    },
    {
      name: "Carlos Eduardo Lima",
      email: "carlos.lima@empresa.com.br",
      product: "E-book: Guia Completo de Vendas",
      amount: 89.9,
      method: PaymentMethod.pix,
      displayMethod: "Cartão" as const,
      status: PaymentStatus.finished,
      daysAgo: 1,
      hoursAgo: 0,
      minutesAgo: 42,
    },
    {
      name: "Maria Fernanda Costa",
      email: "maria.costa@startup.com",
      product: "Consultoria Premium - 1h",
      amount: 450.0,
      method: PaymentMethod.pix,
      displayMethod: "Boleto" as const,
      status: PaymentStatus.peding,
      daysAgo: 2,
      hoursAgo: 3,
      minutesAgo: 42,
    },
    {
      name: "João Pedro Oliveira",
      email: "joao.oliveira@freelancer.com",
      product: "Mentoria Individual - 30min",
      amount: 180.0,
      method: PaymentMethod.pix,
      displayMethod: "Pix" as const,
      status: PaymentStatus.finished,
      daysAgo: 2,
      hoursAgo: 2,
      minutesAgo: 42,
    },
    {
      name: "Patricia Almeida",
      email: "patricia.almeida@consultoria.com",
      product: "Workshop Online: Estratégias de Vendas",
      amount: 297.5,
      method: PaymentMethod.pix,
      displayMethod: "Cartão" as const,
      status: PaymentStatus.finished,
      daysAgo: 3,
      hoursAgo: 2,
      minutesAgo: 42,
    },
    {
      name: "Ricardo Santos",
      email: "ricardo.santos@tech.com",
      product: "Curso de Desenvolvimento Web",
      amount: 599.0,
      method: PaymentMethod.pix,
      displayMethod: "Pix" as const,
      status: PaymentStatus.finished,
      daysAgo: 4,
      hoursAgo: 5,
      minutesAgo: 15,
    },
    {
      name: "Fernanda Oliveira",
      email: "fernanda.oliveira@design.com",
      product: "Pacote de Templates Premium",
      amount: 149.9,
      method: PaymentMethod.pix,
      displayMethod: "Boleto" as const,
      status: PaymentStatus.peding,
      daysAgo: 5,
      hoursAgo: 1,
      minutesAgo: 30,
    },
    {
      name: "Lucas Rodrigues",
      email: "lucas.rodrigues@marketing.com",
      product: "Consultoria de Marketing Digital",
      amount: 350.0,
      method: PaymentMethod.pix,
      displayMethod: "Cartão" as const,
      status: PaymentStatus.finished,
      daysAgo: 6,
      hoursAgo: 8,
      minutesAgo: 20,
    },
    {
      name: "Juliana Costa",
      email: "juliana.costa@empresa.com",
      product: "Plano Mensal de Suporte",
      amount: 199.0,
      method: PaymentMethod.pix,
      displayMethod: "Pix" as const,
      status: PaymentStatus.finished,
      daysAgo: 7,
      hoursAgo: 12,
      minutesAgo: 10,
    },
    {
      name: "Maria Eduarda Moreira",
      email: "dudinhapink_pets@petshop.com",
      product: "Curso Método de Adestramento",
      amount: 429.0,
      method: PaymentMethod.pix,
      displayMethod: "Cartão" as const,
      status: PaymentStatus.cancelled,
      daysAgo: 8,
      hoursAgo: 6,
      minutesAgo: 45,
    },
  ];

  return mockCustomers.map((customer, index) => {
    const createdDate = new Date(now);
    createdDate.setDate(createdDate.getDate() - customer.daysAgo);
    createdDate.setHours(createdDate.getHours() - customer.hoursAgo);
    createdDate.setMinutes(createdDate.getMinutes() - customer.minutesAgo);

    const expiresDate = new Date(createdDate);
    expiresDate.setDate(expiresDate.getDate() + 7);

    const confirmedDate = customer.status === PaymentStatus.finished ? createdDate : null;

    // Taxa de gateway: 2.99% + R$ 0,20
    const gatewayFee = customer.amount * 0.0299 + 0.2;
    const amountWithGatewayFees = customer.amount + gatewayFee;
    const amountWithAllFees = amountWithGatewayFees;

    return {
      id: `mock-payment-${index + 1}`,
      paymentLinkId: `mock-link-${index + 1}`,
      paymentLink: {
        id: `mock-link-${index + 1}`,
        description: customer.product,
        url: `https://demo.com/pay/mock-link-${index + 1}`,
        hash: `mock-hash-${index + 1}`,
        sellerId: "mock-seller-id",
        status: "ACTIVE" as any,
        qtdPayments: 1,
        amount: customer.amount,
        createdAt: createdDate,
      },
      externalId: `ext-${index + 1}`,
      customerId: `mock-customer-${index + 1}`,
      purchaser: PurchaserProvider.SPLITPAY,
      method: customer.method,
      displayMethod: customer.displayMethod,
      amount: customer.amount,
      amountWithFeesGateway: amountWithGatewayFees,
      amountWithAllFees: amountWithAllFees,
      customerName: customer.name,
      customerEmail: customer.email,
      status: customer.status,
      qrCode: null,
      createdAt: createdDate,
      expiresAt: expiresDate,
      confirmedAt: confirmedDate,
    };
  });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// Estender Payment para incluir método de exibição customizado
type PaymentWithDisplayMethod = Payment & {
  displayMethod?: "Pix" | "Boleto" | "Cartão";
};

function formatPaymentMethod(payment: PaymentWithDisplayMethod): "Pix" | "Boleto" | "Cartão" {
  // Se tiver displayMethod customizado, usar ele
  if (payment.displayMethod) {
    return payment.displayMethod;
  }
  // Caso contrário, usar o método padrão
  switch (payment.method) {
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
  const [data, setData] = useState<PaymentWithDisplayMethod[]>([]);
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

          // Converter para PaymentWithDisplayMethod
          const convertedData: PaymentWithDisplayMethod[] = rawData.map((payment) => ({
            ...payment,
            displayMethod: undefined, // API não retorna displayMethod
          }));

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
              : convertedData.length;

          setData(convertedData);
          setTotalPages(totalPagesValue);
          setTotalRecords(totalRecordsValue);

          if (onDataChange) {
            onDataChange(convertedData);
          }
        } else {
          // MODO DEMO: Se não houver dados, usar dados mockados
          const mockData = generateMockData();
          setData(mockData);
          setTotalPages(1);
          setTotalRecords(mockData.length);

          if (onDataChange) {
            onDataChange(mockData);
          }
        }
      } catch (_error) {
        // MODO DEMO: Em caso de erro, usar dados mockados
        const mockData = generateMockData();
        setData(mockData);
        setTotalPages(1);
        setTotalRecords(mockData.length);

        if (onDataChange) {
          onDataChange(mockData);
        }
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
              const paymentMethod = formatPaymentMethod(payment);
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
