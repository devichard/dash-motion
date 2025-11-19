"use client";

import { BadgeCent, Ban, EllipsisIcon, Handshake, LogIn, Settings } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { type Column, DataTable, formatCNPJ, formatCurrency, formatDateTime } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminService, type EnterpriseWithUser } from "@/lib/api/admin-service";
import { apiClient } from "@/lib/api/client";
import AcquirersDialog from "./acquirers-dialog";
import FeesSheet from "./fees-sheet";
import PermissionsDialog from "./permissions-dialog";

export interface EnterpriseItem {
  uuid: string;
  image: string;
  enterprise: string;
  cnpj: string;
  phone: string;
  email: string;
  sales: number;
  balance: number;
  created: Date;
  status: "Ativos" | "Inativos";
  userId?: string;
}

interface TableEnterpriseProps {
  statusFilter: string;
  searchQuery: string;
  onDataChange?: (data: EnterpriseItem[]) => void;
}

export default function TableEnterprise({ statusFilter, searchQuery, onDataChange }: TableEnterpriseProps) {
  const [enterprises, setEnterprises] = useState<EnterpriseItem[]>([]);
  const [openFeesDialog, setOpenFeesDialog] = useState(false);
  const [openLoginAlert, setOpenLoginAlert] = useState(false);
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [openAcquirersDialog, setOpenAcquirersDialog] = useState(false);
  const [openBlockAlert, setOpenBlockAlert] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<{
    id: string;
    name: string;
    cnpj: string;
    userId?: string;
  } | null>(null);

  useEffect(() => {
    async function fetchEnterprises() {
      try {
        const response = await adminService.getEnterprisesAll();
        if (!response.success || !response.data) return;

        const enterprisesRaw = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
            ? response.data.data
            : [];

        const enterprisesData = enterprisesRaw as EnterpriseWithUser[];

        const userIdsToFetch = Array.from(
          new Set(enterprisesData.filter((e) => !e.user && e.userId).map((e) => e.userId)),
        );

        const userStatusMap: Record<string, boolean> = {};

        if (userIdsToFetch.length > 0) {
          const requests = userIdsToFetch.map(async (userId) => {
            try {
              const result = await apiClient.get<{ approved: boolean }>(`/api/v1/users/${userId}`);
              if (result.success && result.data) {
                userStatusMap[userId] = result.data.approved;
              }
            } catch {
              console.error("Erro ao buscar user:", userId);
            }
          });

          await Promise.all(requests);
        }

        const mappedData: EnterpriseItem[] = enterprisesData.map((e) => {
          const approved = e.user?.approved ?? (e.userId ? userStatusMap[e.userId] : false);

          return {
            uuid: e.id,
            image: "/img/logo-green-background.png",
            enterprise: e.commercialName,
            cnpj: formatCNPJ(e.cnpj),
            phone: e.phone,
            email: e.email,
            sales: 0,
            balance: 0,
            created: new Date(e.createdAt),
            status: approved ? "Ativos" : "Inativos",
            userId: e.userId,
          };
        });

        setEnterprises(mappedData);
        onDataChange?.(mappedData);
      } catch (error) {
        console.error("Failed to fetch enterprises", error);
      }
    }

    fetchEnterprises();
  }, [onDataChange]);

  const handleOpenLoginAlert = (enterprise: string, cnpj: string) => {
    setSelectedEnterprise({ id: "", name: enterprise, cnpj });
    setOpenLoginAlert(true);
  };

  const handleOpenFeesSheet = (enterpriseId: string, enterprise: string, cnpj: string, userId?: string) => {
    setSelectedEnterprise({ id: enterpriseId, name: enterprise, cnpj, userId });
    setOpenFeesDialog(true);
  };

  const handleOpenPermissionsDialog = (enterprise: string, cnpj: string) => {
    setSelectedEnterprise({ id: "", name: enterprise, cnpj });
    setOpenPermissionsDialog(true);
  };

  const handleOpenAcquirersDialog = (enterprise: string, cnpj: string) => {
    setSelectedEnterprise({ id: "", name: enterprise, cnpj });
    setOpenAcquirersDialog(true);
  };

  const handleConfirmLogin = () => {
    console.log("Logging in as:", selectedEnterprise);
    setOpenLoginAlert(false);
  };

  const handleOpenBlockAlert = (enterprise: string, cnpj: string) => {
    setSelectedEnterprise({ id: "", name: enterprise, cnpj });
    setOpenBlockAlert(true);
  };

  const handleConfirmBlock = () => {
    console.log("Blocking enterprise:", selectedEnterprise);
    setOpenBlockAlert(false);
  };

  const handleFeesSaved = () => {
    console.log("Fees saved successfully");
  };

  const columns: Column<EnterpriseItem>[] = [
    {
      header: "Razão Social",
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
      header: "Total em Vendas",
      accessor: (item) => formatCurrency(item.sales),
    },
    {
      header: "Saldo da Empresa",
      accessor: (item) => formatCurrency(item.balance),
    },
    {
      header: "Criado em",
      accessor: (item) => formatDateTime(item.created),
    },
    {
      header: "Atividade",
      accessor: (item) => (
        <Badge variant="outline" className="gap-1.5">
          <span
            className={`size-1.5 rounded-full ${item.status === "Ativos" ? "bg-green-500" : "bg-red-500"}`}
            aria-hidden="true"
          ></span>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Ação",
      accessor: (item) => renderActions(item),
      className: "text-right px-4",
    },
  ];

  const filterFunction = (item: EnterpriseItem) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.enterprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cnpj.includes(searchQuery);
    return matchesStatus && matchesSearch;
  };

  const renderActions = (item: EnterpriseItem) => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="shadow-none" aria-label="Edit item">
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg"
          side={"bottom"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-foreground">{item.enterprise}</span>
                <span className="truncate text-xs text-muted-foreground">{item.cnpj}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleOpenFeesSheet(item.uuid, item.enterprise, item.cnpj, item.userId)}>
              <BadgeCent />
              Alterar Taxas
            </DropdownMenuItem>
            <DropdownMenuItem disabled onClick={() => handleOpenPermissionsDialog(item.enterprise, item.cnpj)}>
              <Settings />
              Alterar Permissões
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenLoginAlert(item.enterprise, item.cnpj)}>
              <LogIn />
              Fazer Login
            </DropdownMenuItem>
            <DropdownMenuItem disabled onClick={() => handleOpenAcquirersDialog(item.enterprise, item.cnpj)}>
              <Handshake />
              Adquirentes Customizadas
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => handleOpenBlockAlert(item.enterprise, item.cnpj)}>
            <Ban />
            Bloquear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const sortFunction = (a: EnterpriseItem, b: EnterpriseItem) => b.created.getTime() - a.created.getTime();

  return (
    <>
      <DataTable
        data={enterprises}
        columns={columns}
        itemsPerPage={9}
        emptyMessage="Nenhuma solicitação encontrada"
        onFilter={filterFunction}
        onSort={sortFunction}
      />

      <FeesSheet
        open={openFeesDialog}
        onOpenChange={setOpenFeesDialog}
        enterpriseName={selectedEnterprise?.name}
        cnpj={selectedEnterprise?.cnpj}
        sellerId={selectedEnterprise?.userId}
        onFeesSaved={handleFeesSaved}
      />

      <PermissionsDialog
        open={openPermissionsDialog}
        onOpenChange={setOpenPermissionsDialog}
        enterpriseName={selectedEnterprise?.name}
        cnpj={selectedEnterprise?.cnpj}
      />

      <AcquirersDialog
        open={openAcquirersDialog}
        onOpenChange={setOpenAcquirersDialog}
        enterpriseName={selectedEnterprise?.name}
        cnpj={selectedEnterprise?.cnpj}
      />

      <AlertDialog open={openLoginAlert} onOpenChange={setOpenLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fazer Login na Empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja fazer login como{" "}
              <span className="font-semibold text-foreground">{selectedEnterprise?.name}</span>
              {selectedEnterprise?.cnpj && (
                <>
                  {" "}
                  (<span className="text-foreground">{selectedEnterprise.cnpj}</span>)
                </>
              )}
              ? Você será redirecionado para o painel da empresa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary-button hover:bg-primary-button/70 text-foreground"
              onClick={handleConfirmLogin}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openBlockAlert} onOpenChange={setOpenBlockAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bloquear Empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja bloquear{" "}
              <span className="font-semibold text-foreground">{selectedEnterprise?.name}</span>
              {selectedEnterprise?.cnpj && (
                <>
                  {" "}
                  (<span className="text-foreground">{selectedEnterprise.cnpj}</span>)
                </>
              )}
              ? Esta ação impedirá que a empresa realize transações e acesse o sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBlock}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Bloquear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
