"use client";

import { ClockArrowDown, EllipsisIcon } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Column, DataTable, formatCurrency, formatNullableDateTime } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminService } from "@/lib/api/admin-service";
import type { RobinHoodRankingItem, VisibilityLogsResponse } from "@/types/robin-hood";

interface TableBillingsProps {
  data?: RobinHoodRankingItem[];
}

export default function TableBillings({ data }: TableBillingsProps) {
  const [openRetentionModal, setOpenRetentionModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<{ name: string; sellerId: string } | null>(null);
  const [retentionRules, setRetentionRules] = useState<number | null>(null);
  const [openLogsModal, setOpenLogsModal] = useState(false);
  const [logs, setLogs] = useState<VisibilityLogsResponse>();
  const [logsLoading, setLogsLoading] = useState(false);

  const handleOpenLogsModal = async (item: RobinHoodRankingItem) => {
    setSelectedBilling({ name: item.companyName, sellerId: item.sellerId });
    setOpenLogsModal(true);
    setLogsLoading(true);

    try {
      const response = await adminService.getRankingVisibilityLogs(1, 10, item.sellerId);
      if (response.success) {
        setLogs(response.data);
        console.log(response.data);
      } else {
        toast.error("Erro ao buscar logs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao buscar logs");
    } finally {
      setLogsLoading(false);
    }
  };

  const handleOpenRetentionModal = (item: RobinHoodRankingItem) => {
    setSelectedBilling({ name: item.companyName, sellerId: item.sellerId });
    setOpenRetentionModal(true);
  };

  const handleApplyRetention = async () => {
    if (!selectedBilling || retentionRules === null) return;

    try {
      const response = await adminService.applyVisibilityToSeller({
        seller_id: selectedBilling.sellerId,
        percentage_hidden: retentionRules,
      });
      if (response.success) {
        toast.success("Regras de retenção aplicadas com sucesso!");
        setOpenRetentionModal(false);
      } else {
        toast.error("Erro ao aplicar regras de retenção");
        console.error(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderActions = (item: RobinHoodRankingItem) => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="shadow-none" aria-label="Ações">
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-foreground">{item.companyName}</span>
                <span className="truncate text-xs text-muted-foreground">{item.cnpj}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleOpenRetentionModal(item)}>
              <ClockArrowDown className="text-green-500" />
              <span className="text-green-500">Aplicar Retenção</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenLogsModal(item)}>
              <EllipsisIcon className="text-blue-500" />
              <span className="text-blue-500">Ver logs</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const columns: Column<RobinHoodRankingItem>[] = [
    {
      header: "Empresa",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <div className="font-medium">{item.position}º</div>
          <Avatar className="w-10 h-10">
            <AvatarImage src="/img/logo-green-background.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{item.companyName}</div>
            <span className="text-muted-foreground mt-0.5 text-xs">{item.cnpj}</span>
          </div>
        </div>
      ),
      className: "px-4",
    },

    {
      header: "Conversão",
      accessor: (item) => (
        <div>
          <div className="font-medium">{item.paidPercentage}%</div>
          <span className="text-muted-foreground text-xs">{item.transactions} transações</span>
        </div>
      ),
    },
    {
      header: "Última transação",
      accessor: (item) => (
        <div>
          <div className="font-medium">{formatNullableDateTime(item.lastPayment)}</div>
        </div>
      ),
    },
    {
      header: "Total",
      accessor: (item) => (
        <div>
          <div className="font-medium">{formatCurrency(item.totalValue)}</div>
        </div>
      ),
    },
    {
      header: "Ação",
      accessor: (item) => renderActions(item),
      className: "text-right px-4",
    },
  ];

  const sortFunction = (a: RobinHoodRankingItem, b: RobinHoodRankingItem) => b.position - a.position;

  const tableData = data?.map((item) => ({
    ...item,
    uuid: item.sellerId,
  }));
  return (
    <>
      <DataTable
        data={tableData ?? []}
        columns={columns}
        itemsPerPage={9}
        emptyMessage="Nenhuma antecipação encontrada"
        onSort={sortFunction}
      />

      <AlertDialog open={openRetentionModal} onOpenChange={setOpenRetentionModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aplicar Retenção</AlertDialogTitle>
            <AlertDialogDescription>
              Defina a porcentagem de retenção que deseja aplicar para{" "}
              <span className="font-semibold">{selectedBilling?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <input
              type="number"
              className="w-full border rounded p-2"
              placeholder="Porcentagem de retenção"
              value={retentionRules ?? ""}
              onChange={(e) => setRetentionRules(Number(e.target.value))}
              min={0}
              max={100}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApplyRetention}
              className="bg-primary-button text-white hover:bg-primary-button/80"
            >
              Aplicar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openLogsModal} onOpenChange={setOpenLogsModal}>
        <AlertDialogContent className="max-w-2xl w-full rounded-2xl p-6 shadow-lg">
          <AlertDialogHeader className="mb-4">
            <AlertDialogTitle className="text-2xl font-bold">Logs de Visibilidade</AlertDialogTitle>
            <AlertDialogDescription className=" mt-1">
              Retenção aplicada no seller: <span className="font-semibold text-lg">{selectedBilling?.name}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="overflow-y-auto max-h-[400px]">
            {logsLoading ? (
              <p className=" text-center py-8">Carregando...</p>
            ) : logs?.data.length === 0 ? (
              <p className=" text-center py-8">Nenhum log encontrado.</p>
            ) : (
              <Card>
                <ul className="space-y-4">
                  {logs?.data.map((log) => (
                    <li key={log.id} className=" p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : "-"}
                        </span>
                        <span
                          className={`text-2xl font-semibold ${
                            log.percentageHidden > 50 ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {log.percentageHidden ?? "-"}%
                        </span>
                      </div>
                      <p className="">
                        <strong>Aplicado por:</strong> {log.appliedByUser?.companyName ?? "-"}
                      </p>
                      <p className="">
                        <strong>Email:</strong> {log.appliedByUser?.email ?? "-"}
                      </p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="px-6 py-2 rounded-lg transition-colors">Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
