"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
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
import { type Column, DataTable, formatDateTime } from "@/components/ui/data-table";

export interface AffiliateItem {
  uuid: string;
  id: string;
  name: string;
  email: string;
  image: string;
  company: string;
  status: "Pendente" | "Aprovado" | "Recusado";
  created: Date;
}

interface TableAffiliatesProps {
  statusFilter: string;
  searchQuery: string;
}

const mockAffiliates: AffiliateItem[] = [
  {
    uuid: "1",
    id: "1",
    name: "Carlos Oliveira",
    email: "carlos.oliveira@exemplo.com",
    image: "/img/logo-green-background.png",
    company: "Empresa ABC",
    status: "Pendente",
    created: new Date("2024-04-01"),
  },
  {
    uuid: "2",
    id: "2",
    name: "Ana Paula",
    email: "ana.paula@exemplo.com",
    image: "/img/logo-green-background.png",
    company: "Empresa XYZ",
    status: "Aprovado",
    created: new Date("2024-03-15"),
  },
  {
    uuid: "3",
    id: "3",
    name: "Roberto Lima",
    email: "roberto.lima@exemplo.com",
    image: "/img/logo-green-background.png",
    company: "Empresa DEF",
    status: "Recusado",
    created: new Date("2024-02-20"),
  },
];

export default function TableAffiliates({ statusFilter, searchQuery }: TableAffiliatesProps) {
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>(mockAffiliates);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<AffiliateItem | null>(null);

  const handleApprove = (affiliate: AffiliateItem) => {
    setSelectedAffiliate(affiliate);
    setOpenApproveDialog(true);
  };

  const handleReject = (affiliate: AffiliateItem) => {
    setSelectedAffiliate(affiliate);
    setOpenRejectDialog(true);
  };

  const confirmApprove = () => {
    if (!selectedAffiliate) return;

    setAffiliates((prev) =>
      prev.map((affiliate) =>
        affiliate.uuid === selectedAffiliate.uuid ? { ...affiliate, status: "Aprovado" } : affiliate,
      ),
    );

    toast.success(`Afiliação de ${selectedAffiliate.name} aprovada com sucesso`);
    setOpenApproveDialog(false);
    setSelectedAffiliate(null);
  };

  const confirmReject = () => {
    if (!selectedAffiliate) return;

    setAffiliates((prev) =>
      prev.map((affiliate) =>
        affiliate.uuid === selectedAffiliate.uuid ? { ...affiliate, status: "Recusado" } : affiliate,
      ),
    );

    toast.success(`Afiliação de ${selectedAffiliate.name} recusada`);
    setOpenRejectDialog(false);
    setSelectedAffiliate(null);
  };

  const getStatusBadgeColor = (status: AffiliateItem["status"]) => {
    switch (status) {
      case "Aprovado":
        return "bg-green-500";
      case "Pendente":
        return "bg-yellow-500";
      case "Recusado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns: Column<AffiliateItem>[] = [
    {
      header: "Afiliado",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <Image className="rounded-full" src={item.image} width={40} height={40} alt={item.name} />
          <div>
            <div className="font-medium">{item.name}</div>
            <span className="text-muted-foreground mt-0.5 text-xs">{item.email}</span>
          </div>
        </div>
      ),
      className: "px-4",
    },
    {
      header: "Empresa",
      accessor: (item) => item.company,
    },
    {
      header: "Solicitado em",
      accessor: (item) => formatDateTime(item.created),
    },
    {
      header: "Status",
      accessor: (item) => (
        <Badge variant="outline" className="gap-1.5">
          <span className={`size-1.5 rounded-full ${getStatusBadgeColor(item.status)}`} aria-hidden="true"></span>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Ação",
      accessor: (item) => (
        <div className="flex justify-end gap-2">
          {item.status === "Pendente" && (
            <>
              <Button size="sm" variant="outline" className="h-8 gap-1.5" onClick={() => handleApprove(item)}>
                <Check className="h-4 w-4" />
                Aprovar
              </Button>
              <Button size="sm" variant="destructive" className="h-8 gap-1.5" onClick={() => handleReject(item)}>
                <X className="h-4 w-4" />
                Recusar
              </Button>
            </>
          )}
          {item.status !== "Pendente" && <span className="text-muted-foreground text-sm">-</span>}
        </div>
      ),
      className: "text-right px-4",
    },
  ];

  const filterFunction = (item: AffiliateItem) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  };

  const sortFunction = (a: AffiliateItem, b: AffiliateItem) => b.created.getTime() - a.created.getTime();

  return (
    <>
      <DataTable
        data={affiliates}
        columns={columns}
        itemsPerPage={9}
        emptyMessage="Nenhuma solicitação de afiliação encontrada"
        onFilter={filterFunction}
        onSort={sortFunction}
      />

      <AlertDialog open={openApproveDialog} onOpenChange={setOpenApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprovar Afiliação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja aprovar a solicitação de afiliação de{" "}
              <span className="font-semibold text-foreground">{selectedAffiliate?.name}</span> da empresa{" "}
              <span className="font-semibold text-foreground">{selectedAffiliate?.company}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary-button hover:bg-primary-button/70 text-foreground"
              onClick={confirmApprove}
            >
              Aprovar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openRejectDialog} onOpenChange={setOpenRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recusar Afiliação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja recusar a solicitação de afiliação de{" "}
              <span className="font-semibold text-foreground">{selectedAffiliate?.name}</span> da empresa{" "}
              <span className="font-semibold text-foreground">{selectedAffiliate?.company}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmReject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Recusar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
