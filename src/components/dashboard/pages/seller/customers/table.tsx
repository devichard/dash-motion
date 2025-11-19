"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/components/ui/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sellerCustomerService } from "@/lib/api/seller-customer-service";
import type { SellerCustomer } from "@/types/seller-customer";

export interface CustomerItem {
  uuid: string;
  name: string;
  email: string;
  phone: string;
  created: Date;
}

const ITEMS_PER_PAGE = 9;

function formatPhone(phone: string | null): string {
  if (!phone) return "-";
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, "");
  // Formata como (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(
      7
    )}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
}

function mapSellerCustomerToItem(customer: SellerCustomer): CustomerItem {
  // createdAt pode vir como string (JSON) ou Date
  let createdAt: Date;
  if (customer.createdAt instanceof Date) {
    createdAt = customer.createdAt;
  } else if (typeof customer.createdAt === "string") {
    createdAt = new Date(customer.createdAt);
  } else {
    createdAt = new Date();
  }

  // Validar se a data é válida
  if (Number.isNaN(createdAt.getTime())) {
    createdAt = new Date();
  }

  return {
    uuid: customer.id || "",
    name: customer.name || "",
    email: customer.email || "",
    phone: formatPhone(customer.phone),
    created: createdAt,
  };
}

interface TableTransactionProps {
  searchQuery?: string;
  sortOrder?: "newest" | "oldest";
  onDataChange?: (data: CustomerItem[]) => void;
}

export default function TableTransaction({
  searchQuery = "",
  sortOrder = "newest",
  onDataChange,
}: TableTransactionProps) {
  const [data, setData] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Resetar para página 1 quando busca ou ordenação mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await sellerCustomerService.list(
          currentPage,
          ITEMS_PER_PAGE
        );

        if (response.success) {
          const responseData = response.data;

          // Verificar se response.data é um array diretamente ou se tem propriedade data
          let rawData = [];

          if (Array.isArray(responseData)) {
            // Se response.data já é um array
            rawData = responseData;
          } else if (responseData && Array.isArray(responseData.data)) {
            // Se response.data.data é um array (estrutura esperada)
            rawData = responseData.data;
          } else if (
            responseData?.data &&
            typeof responseData.data === "object" &&
            !Array.isArray(responseData.data)
          ) {
            // Se response.data.data é um objeto (pode ser array-like)
            rawData = Object.values(responseData.data).filter(
              (item: any) => item && typeof item === "object" && item.id
            ) as any[];
          }

          // Mapear os dados - createdAt vem como string do JSON
          const mappedData: CustomerItem[] = [];
          for (const customer of rawData) {
            try {
              const mapped = mapSellerCustomerToItem(customer);
              mappedData.push(mapped);
            } catch (error) {
              // Ignorar erros de mapeamento
            }
          }

          // Aplicar busca e ordenação no frontend apenas na página atual
          let filteredData = [...mappedData];

          // Aplicar filtro de busca
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredData = filteredData.filter(
              (item) =>
                item.name.toLowerCase().includes(query) ||
                item.email.toLowerCase().includes(query)
            );
          }

          // Aplicar ordenação
          filteredData.sort((a, b) => {
            return sortOrder === "newest"
              ? b.created.getTime() - a.created.getTime()
              : a.created.getTime() - b.created.getTime();
          });

          setData(filteredData);
          // Acessar totalPages e totalRecords da resposta - sempre usar valores da API quando disponíveis
          // A API retorna SellerCustomerResponse com estrutura: { data: [], totalPages, totalRecords, currentPage, perPage }
          const totalPagesValue =
            responseData &&
            typeof responseData === "object" &&
            "totalPages" in responseData &&
            typeof responseData.totalPages === "number"
              ? responseData.totalPages
              : 1;
          const totalRecordsValue =
            responseData &&
            typeof responseData === "object" &&
            "totalRecords" in responseData &&
            typeof responseData.totalRecords === "number"
              ? responseData.totalRecords
              : rawData.length;
          setTotalPages(totalPagesValue);
          setTotalRecords(totalRecordsValue);

          if (onDataChange) {
            onDataChange(filteredData);
          }
        } else {
          setData([]);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (error) {
        setData([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentPage, searchQuery, sortOrder, onDataChange]);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  const startIndex =
    totalRecords === 0
      ? 0
      : Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalRecords);
  const endIndex =
    totalRecords === 0
      ? 0
      : Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

  if (loading) {
    return (
      <div className="rounded-lg border">
        <Table>
          <TableHeader className="bg-popover/30 h-12 rounded-xl">
            <TableRow className="hover:bg-transparent">
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <TableRow key={i.toString()} className="h-16">
                <TableCell colSpan={4} className="text-center">
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
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground py-8"
              >
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.uuid} className="h-16">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span>{item.phone}</span>
                </TableCell>
                <TableCell>
                  <span>{formatDateTime(item.created)}</span>
                </TableCell>
              </TableRow>
            ))
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
