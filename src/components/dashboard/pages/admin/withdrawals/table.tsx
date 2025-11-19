"use client";

import { Activity, BadgeCent, Check, ClipboardList, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Column, DataTable, formatCurrency, formatDateTime } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HyperText } from "@/components/ui/hyper-text";
import { NumberTicker } from "@/components/ui/number-ticker";
import { adminService } from "@/lib/api/admin-service";
import { systemFeesService } from "@/lib/api/fees-service";
import type { WithdrawalListResponse } from "@/types/withdrawals";

export interface AnticipationsItem {
  uuid: string;
  image: string;
  enterprise: string;
  cnpj: string;
  responsible: string;
  value: number;
  sellerId: string;
  transferId: string;
  bankAccount?: string;
  created: Date;
  updated: Date;
  status: "Pendente" | "Finalizado" | "Recusado";
}

export function adaptWithdrawal(w: WithdrawalListResponse): AnticipationsItem {
  return {
    uuid: w.id,
    image: "/img/logo-green-background.png",
    enterprise: w.seller?.companyName ?? "Empresa",
    cnpj: w.seller?.enterprises?.[0]?.cnpj ?? "",
    responsible: "",
    value: w.amount,
    sellerId: w.sellerId,
    transferId: w.id,
    bankAccount: undefined,
    created: new Date(w.requestedAt),
    updated: w.completedAt ? new Date(w.completedAt) : new Date(w.requestedAt),
    status:
      w.status === "COMPLETED"
        ? "Finalizado"
        : w.status === "REQUESTED" || w.status === "PROCESSING"
          ? "Pendente"
          : "Recusado",
  };
}

interface TableAnticipationsProps {
  data?: AnticipationsItem[];
  statusFilter: string;
  searchQuery: string;
  onDataChange?: (data: AnticipationsItem[]) => void;
}

export default function TableAnticipations({ statusFilter, searchQuery, onDataChange }: TableAnticipationsProps) {
  const [selectedAnticipation, setSelectedAnticipation] = useState<AnticipationsItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [list, setList] = useState<AnticipationsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fee, setFee] = useState<number | null>(null);

  const loadWithdrawals = useCallback(async () => {
    try {
      const response = await adminService.getWithdrawalsRequest(1, 50);

      if (!response.success || !response.data) {
        toast.error("Erro ao carregar solicitações");
        return;
      }

      const raw = Array.isArray(response.data) ? response.data : (response.data.data ?? []);
      const mapped = raw.map(adaptWithdrawal);

      setList(mapped);
      if (onDataChange) onDataChange(mapped);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível carregar as solicitações");
    } finally {
      setLoading(false);
    }
  }, [onDataChange]);

  useEffect(() => {
    loadWithdrawals();
  }, [loadWithdrawals]);

  const handleApprove = async () => {
    if (!selectedAnticipation) return;

    try {
      setLoading(true);
      await adminService.approveWithdrawal(selectedAnticipation.uuid);
      toast.success("Saque aprovada com sucesso");

      await loadWithdrawals();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao aprovar saque");
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAnticipation) return;

    try {
      setLoading(true);
      const response = await adminService.rejectWithdrawal(selectedAnticipation.uuid);
      if (response.success) {
        toast.success("Saque rejeitado com sucesso");
        await loadWithdrawals();
      } else {
        console.error(response.errorMessage);
        toast.error("Erro ao rejeitar saque");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao reprovar saque");
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
  };

  const columns: Column<AnticipationsItem>[] = [
    {
      header: "Empresa",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <Image className="rounded-full" src={item.image} width={40} height={40} alt={item.enterprise} />
          <div>
            <div className="font-medium">{item.enterprise}</div>
            <span className="text-muted-foreground mt-0.5 text-xs">{item.cnpj}</span>
          </div>
        </div>
      ),
      className: "px-4",
    },
    {
      header: "Valor",
      accessor: (item) => formatCurrency(item.value),
    },
    {
      header: "Criado em",
      accessor: (item) => formatDateTime(item.created),
    },
    {
      header: "Status",
      accessor: (item) => (
        <Badge variant="outline" className="gap-1.5">
          <span
            className={`size-1.5 rounded-full ${
              item.status === "Finalizado"
                ? "bg-green-500"
                : item.status === "Pendente"
                  ? "bg-yellow-500"
                  : item.status === "Recusado"
                    ? "bg-red-500"
                    : "bg-gray-500"
            }`}
            aria-hidden="true"
          ></span>
          {item.status}
        </Badge>
      ),
    },
  ];

  const handleRowClick = async (anticipation: AnticipationsItem) => {
    try {
      const feeResponse = await systemFeesService.findBySellerId(anticipation.sellerId);
      if (feeResponse.success) {
        const sellerFees = feeResponse.data;
        const withdrawalFee = sellerFees?.find((f) => f.feeType === "FIXED" && f.description?.includes("Withdrawal"));
        setFee(Number(withdrawalFee?.feeValue));
      } else {
        toast.error("Não foi possível buscar as taxas do seller");
      }

      setIsDialogOpen(true);
      setSelectedAnticipation(anticipation);
    } catch (error) {
      console.error(error);
      toast.error("Erro não esperado");
    }
  };

  const filterFunction = (item: AnticipationsItem) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.enterprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cnpj.includes(searchQuery);
    return matchesStatus && matchesSearch;
  };

  const sortFunction = (a: AnticipationsItem, b: AnticipationsItem) => b.created.getTime() - a.created.getTime();

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <DataTable
        data={list}
        columns={columns}
        itemsPerPage={9}
        emptyMessage="Nenhuma Antecipações encontrado"
        onFilter={filterFunction}
        onSort={sortFunction}
        onRowClick={handleRowClick}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-4xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle>Detalhes da Antecipação</DialogTitle>
                <DialogDescription>Recebedor Responsável pela Antecipação</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedAnticipation && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <Avatar className="size-16">
                  <AvatarImage src={selectedAnticipation.image} />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedAnticipation.enterprise}</h3>
                  <p className="text-sm text-muted-foreground">{selectedAnticipation.cnpj}</p>
                </div>
                <Badge variant="outline" className="gap-1.5">
                  <span
                    className={`size-1.5 rounded-full ${
                      selectedAnticipation.status === "Finalizado"
                        ? "bg-green-500"
                        : selectedAnticipation.status === "Pendente"
                          ? "bg-yellow-500"
                          : selectedAnticipation.status === "Recusado"
                            ? "bg-red-500"
                            : "bg-gray-500"
                    }`}
                    aria-hidden="true"
                  ></span>
                  {selectedAnticipation.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 rounded-lg border border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <BadgeCent size={16} />
                    <span className="text-sm">Valor da Antecipação</span>
                  </div>
                  <p className="text-3xl">
                    <NumberTicker value={selectedAnticipation.value} variant="currency" decimalPlaces={2} />
                  </p>
                </div>

                <div className="p-6 rounded-lg border border-destructive/20 bg-destructive/5">
                  <div className="flex items-center gap-2 mb-2 text-destructive">
                    <Activity size={16} />
                    <span className="text-sm">Taxas</span>
                  </div>
                  <p className="text-3xl">
                    <NumberTicker value={!fee ? 12 : fee} variant="currency" decimalPlaces={2} />
                  </p>
                </div>

                <div className="p-6 rounded-lg border  bg-blue-400/5 border-blue-400/20">
                  <div className="flex items-center  text-blue-400 gap-2 mb-2">
                    <ClipboardList size={16} />
                    <span className="text-sm">ID da Transferência</span>
                  </div>
                  <HyperText className="text-sm">{selectedAnticipation.transferId}</HyperText>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Última Atualização</p>
                  <p className="text-sm font-medium">{formatDateTime(selectedAnticipation.updated)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Data de Criação</p>
                  <p className="text-sm font-medium">{formatDateTime(selectedAnticipation.created)}</p>
                </div>
              </div>
              <div className={selectedAnticipation.status === "Pendente" ? "flex gap-3 pt-4 border-t" : "hidden"}>
                <Button variant="outline" className="flex-1 gap-2" onClick={handleReject}>
                  <X size={16} />
                  Recusar
                </Button>
                <Button variant="primary" className="flex-1 gap-2" onClick={handleApprove}>
                  <Check size={16} />
                  Aprovar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
