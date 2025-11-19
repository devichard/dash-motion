"use client";

import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Column, DataTable, formatCurrency, formatDateTime } from "@/components/ui/data-table";
import { paymentLinksService } from "@/lib/api/payment-links";
import type { PaymentLink } from "@/types/payment-links";

export interface PaymentLinkItem {
  uuid: string;
  code: string;
  description: string;
  value: number;
  payments: number;
  status: "Ativo" | "Inativo";
  created: Date;
  expiration: Date | null;
}

interface TablePaymentLinksProps {
  searchQuery?: string;
  statusFilter?: string;
}

export default function TablePaymentLinks({ searchQuery = "", statusFilter = "all" }: TablePaymentLinksProps) {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const response = await paymentLinksService.list();

        if (Array.isArray(response)) {
          setLinks(response);
        } else if (response?.success) {
          setLinks(Array.isArray(response.data) ? response.data : []);
        }
      } catch (err) {
        console.error("Erro ao buscar links:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLinks();
  }, []);

  const mappedLinks = useMemo<PaymentLinkItem[]>(() => {
    return links.map((link) => ({
      uuid: link.id,
      code: link.hash,
      description: link.description ?? "Sem descrição",
      value: link.amount,
      payments: link.qtdPayments,
      status: link.status === "ACTIVE" ? "Ativo" : "Inativo",
      created: new Date(link.createdAt),
      expiration: null,
    }));
  }, [links]);

  const filtered = useMemo(() => {
    return mappedLinks
      .filter((item) => {
        const matchStatus = statusFilter === "all" || item.status === statusFilter;

        const matchSearch =
          searchQuery === "" ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.code.toLowerCase().includes(searchQuery.toLowerCase());

        return matchStatus && matchSearch;
      })
      .sort((a, b) => b.created.getTime() - a.created.getTime());
  }, [mappedLinks, searchQuery, statusFilter]);

  if (loading) return <div className="text-center text-muted-foreground">Carregando links de pagamento...</div>;

  const handleCopyLink = (code: string) => {
    const fullLink = `${window.location.origin}/checkout/${code}`;
    navigator.clipboard.writeText(fullLink);
    toast.success("Link copiado!");
  };

  const handleOpenLink = (code: string) => {
    const link = `${window.location.origin}/checkout/${code}`;
    window.open(link, "_blank");
  };

  const confirmDelete = async () => {
    if (!linkToDelete) return;

    try {
      await paymentLinksService.deleteById(linkToDelete);
      toast.success("Link excluído!");
      setLinks((prev) => prev.filter((l) => l.id !== linkToDelete));
    } catch (_err) {
      toast.error("Erro ao excluir link");
    } finally {
      setLinkToDelete(null);
    }
  };

  const columns: Column<PaymentLinkItem>[] = [
    {
      header: "Descrição",
      accessor: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.description}</span>
          <span className="text-xs text-muted-foreground">{item.code}</span>
        </div>
      ),
    },
    {
      header: "Valor",
      accessor: (item) => <span className="font-medium">{formatCurrency(item.value)}</span>,
    },
    {
      header: "Pagamentos",
      accessor: (item) => <span>{item.payments}</span>,
    },
    {
      header: "Criado em",
      accessor: (item) => (
        <div className="flex flex-col text-sm">
          <span>{formatDateTime(item.created)}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (item) => {
        const colorMap = {
          Ativo: "text-green-500 bg-green-500/10 border-green-500/30",
          Inativo: "text-gray-400 bg-gray-500/10 border-gray-500/30",
        };

        return <Badge className={`rounded-full border ${colorMap[item.status]}`}>{item.status}</Badge>;
      },
    },
    {
      header: "Ações",
      accessor: (item) => (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => handleCopyLink(item.code)}>
            <Copy className="size-3" /> Copiar
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleOpenLink(item.code)}>
            <ExternalLink className="size-3" /> Abrir
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setLinkToDelete(item.uuid)}>
            <Trash2 className="size-3" /> Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable data={filtered} columns={columns} itemsPerPage={9} emptyMessage="Nenhum link encontrado" />

      <AlertDialog open={!!linkToDelete} onOpenChange={() => setLinkToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir link</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este link? Essa ação é permanente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
