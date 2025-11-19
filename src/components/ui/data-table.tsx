"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatNullableDateTime = (date: Date | null | undefined | string): string => {
  if (!date) return "-";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export const formatCNPJ = (cnpj: string): string => {
  const numbers = cnpj.replace(/\D/g, "");

  if (numbers.length === 14) {
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  }

  return cnpj;
};

export const formatCPF = (cpf: string): string => {
  const numbers = cpf.replace(/\D/g, "");

  if (numbers.length === 11) {
    return numbers.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }

  return cpf;
};

export const formatCEP = (cep: string): string => {
  const numbers = cep.replace(/\D/g, "");

  if (numbers.length === 8) {
    return numbers.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  }

  return cep;
};

export const formatPhone = (phone: string): string => {
  const numbers = phone.replace(/\D/g, "");

  if (numbers.length === 11) {
    return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (numbers.length === 10) {
    return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  }

  return phone;
};

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  itemsPerPage?: number;
  emptyMessage?: string;
  onFilter?: (item: T) => boolean;
  onSort?: (a: T, b: T) => number;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { uuid: string }>({
  data,
  columns,
  itemsPerPage = 10,
  emptyMessage = "Nenhum item encontrado",
  onFilter,
  onSort,
  onRowClick,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    let items = [...data];

    if (onFilter) {
      items = items.filter(onFilter);
    }

    if (onSort) {
      items.sort(onSort);
    }

    return items;
  }, [data, onFilter, onSort]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  const handleFirstPage = () => setCurrentPage(1);
  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentPage(totalPages);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to reset page when filtered items count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredItems.length]);

  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    return item[column.accessor] as ReactNode;
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader className="bg-popover/30 h-12 rounded-xl">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead key={column.header} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            paginatedItems.map((item) => (
              <TableRow
                className={`h-16 ${onRowClick ? "cursor-pointer" : ""}`}
                key={item.uuid}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column) => (
                  <TableCell key={column.header} className={column.className}>
                    {renderCell(item, column)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between px-4 py-1 border-t">
          <div className="text-xs text-muted-foreground">
            {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length}
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
