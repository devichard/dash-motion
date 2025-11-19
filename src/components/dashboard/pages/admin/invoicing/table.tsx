"use client";

import { BadgeCent, Ban, EllipsisIcon, Handshake, LogIn, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import AcquirersDialog from "@/components/dashboard/pages/admin/enterprise/acquirers-dialog";
import FeesSheet from "@/components/dashboard/pages/admin/enterprise/fees-sheet";
import PermissionsDialog from "@/components/dashboard/pages/admin/enterprise/permissions-dialog";
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
import { type Column, DataTable, formatCurrency } from "@/components/ui/data-table";
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
import type { EnterpriseRevenueData } from "@/types/enterprise";

export function adaptEnterpriseRevenue(data: EnterpriseRevenueData[]) {
  return data.map((item, i) => ({
    ...item,
    uuid: String(i),
  }));
}

export type EnterpriseRevenueItem = EnterpriseRevenueData & {
  uuid: string;
};

export default function TableBillings() {
  const [openFeesDialog, setOpenFeesDialog] = useState(false);
  const [openLoginAlert, setOpenLoginAlert] = useState(false);
  const [openPermissionsDialog, setOpenPermissionsDialog] = useState(false);
  const [openAcquirersDialog, setOpenAcquirersDialog] = useState(false);
  const [openBlockAlert, setOpenBlockAlert] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<{ name: string; cnpj: string } | null>(null);

  const [invoicingData, setInvoicingData] = useState<EnterpriseRevenueData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInvoicingData = async () => {
      try {
        const response = await adminService.getEnterpriseRevenue();

        if (response.success) {
          const raw = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);

          setInvoicingData(raw);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getInvoicingData();
  }, []);

  const handleOpenLoginAlert = (enterprise: string, cnpj: string) => {
    setSelectedBilling({ name: enterprise, cnpj });
    setOpenLoginAlert(true);
  };

  const handleOpenFeesSheet = (enterprise: string, cnpj: string) => {
    setSelectedBilling({ name: enterprise, cnpj });
    setOpenFeesDialog(true);
  };

  const handleOpenPermissionsDialog = (enterprise: string, cnpj: string) => {
    setSelectedBilling({ name: enterprise, cnpj });
    setOpenPermissionsDialog(true);
  };

  const handleOpenAcquirersDialog = (enterprise: string, cnpj: string) => {
    setSelectedBilling({ name: enterprise, cnpj });
    setOpenAcquirersDialog(true);
  };

  const handleConfirmLogin = () => {
    console.log("Logging in as:", selectedBilling);
    setOpenLoginAlert(false);
  };

  const handleOpenBlockAlert = (enterprise: string, cnpj: string) => {
    setSelectedBilling({ name: enterprise, cnpj });
    setOpenBlockAlert(true);
  };

  const handleConfirmBlock = () => {
    console.log("Blocking enterprise:", selectedBilling);
    setOpenBlockAlert(false);
  };

  const renderActions = (item: EnterpriseRevenueData) => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" className="shadow-none" aria-label="Ações">
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
                <span className="truncate font-medium text-foreground">{item.companyName}</span>
                <span className="truncate text-xs text-muted-foreground">{item.cnpj}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleOpenFeesSheet(item.companyName, item.cnpj)}>
              <BadgeCent />
              Alterar Taxas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenPermissionsDialog(item.companyName, item.cnpj)}>
              <Settings />
              Alterar Permissões
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenLoginAlert(item.companyName, item.cnpj)}>
              <LogIn />
              Fazer Login
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenAcquirersDialog(item.companyName, item.cnpj)}>
              <Handshake />
              Adquirentes Customizadas
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => handleOpenBlockAlert(item.companyName, item.cnpj)}>
            <Ban />
            Bloquear
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const columns: Column<EnterpriseRevenueData>[] = [
    {
      header: "Empresa",
      accessor: (item) => (
        <div className="flex items-center gap-3">
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
      header: "PIX",
      accessor: (item) => (
        <div>
          <div className="font-medium">{formatCurrency(item.totalRevenue)}</div>
          <span className="text-muted-foreground text-xs">{item.transactionCount} transações</span>
        </div>
      ),
    },
    {
      header: "Ação",
      accessor: (item) => renderActions(item),
      className: "text-right px-4",
    },
  ];

  const sortFunction = (a: EnterpriseRevenueData, b: EnterpriseRevenueData) => b.totalRevenue - a.totalRevenue;

  if (loading) return <p>Carregando dados...</p>;

  return (
    <>
      <DataTable
        data={adaptEnterpriseRevenue(invoicingData)}
        columns={columns}
        itemsPerPage={9}
        emptyMessage="Nenhuma antecipação encontrada"
        onSort={sortFunction}
      />

      <FeesSheet
        open={openFeesDialog}
        onOpenChange={setOpenFeesDialog}
        enterpriseName={selectedBilling?.name}
        cnpj={selectedBilling?.cnpj}
      />

      <PermissionsDialog
        open={openPermissionsDialog}
        onOpenChange={setOpenPermissionsDialog}
        enterpriseName={selectedBilling?.name}
        cnpj={selectedBilling?.cnpj}
      />

      <AcquirersDialog
        open={openAcquirersDialog}
        onOpenChange={setOpenAcquirersDialog}
        enterpriseName={selectedBilling?.name}
        cnpj={selectedBilling?.cnpj}
      />

      <AlertDialog open={openLoginAlert} onOpenChange={setOpenLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Fazer Login na Empresa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja fazer login como{" "}
              <span className="font-semibold text-foreground">{selectedBilling?.name}</span>
              {selectedBilling?.cnpj && (
                <>
                  {" "}
                  (<span className="text-foreground">{selectedBilling.cnpj}</span>)
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
              <span className="font-semibold text-foreground">{selectedBilling?.name}</span>
              {selectedBilling?.cnpj && (
                <>
                  {" "}
                  (<span className="text-foreground">{selectedBilling.cnpj}</span>)
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
