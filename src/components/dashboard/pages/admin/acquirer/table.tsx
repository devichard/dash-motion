"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type Column, DataTable, formatCurrency } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import FeesAcquired from "./fees-acquired";

export interface AcquirerItem {
  uuid: string;
  tenant: string;
  image: string;
  totalValue: number;
  totalTransactions: number;
}

export const items: AcquirerItem[] = [
  {
    uuid: "UFGAZ",
    tenant: "XdPag",
    image: "/img/logo-green-background.png",
    totalValue: 0.0,
    totalTransactions: 0,
  },
  {
    uuid: "NX3HK",
    tenant: "Ammei",
    image: "/img/logo-green-background.png",
    totalValue: 0.0,
    totalTransactions: 0,
  },
];

export default function TableAcquirer() {
  const [openFeesDialog, setOpenFeesDialog] = useState(false);
  const [selectedAcquirer, setSelectedAcquirer] = useState<{ name: string; uuid: string } | null>(null);

  const columns: Column<AcquirerItem>[] = [
    {
      header: "Tenant",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <Image className="rounded-full" src={item.image} width={40} height={40} alt={item.tenant} />
          <div>
            <div className="font-medium">{item.tenant}</div>
          </div>
        </div>
      ),
      className: "px-4",
    },
    {
      header: "Valor Total",
      accessor: (item) => (
        <div>
          <div className="font-medium">{formatCurrency(item.totalValue)}</div>
        </div>
      ),
    },
    {
      header: "Quantidade de Transações",
      accessor: (item) => (
        <div>
          <span className="text-muted-foreground text-sm">{item.totalTransactions} transações</span>
        </div>
      ),
    },
    {
      header: "Pix",
      accessor: (_item) => <Switch />,
    },
    {
      header: "Cartão",
      accessor: (_item) => <Switch />,
    },
    {
      header: "Boleto",
      accessor: (_item) => <Switch />,
    },
    {
      header: "Ativos",
      accessor: (_item) => <Switch />,
    },
    {
      header: "Ações",
      className: "text-right px-4",
      accessor: (item) => (
        <Button onClick={() => handleOpenFeesAcquired(item.tenant, item.uuid)} size="sm" variant="outline">
          Personalizar
        </Button>
      ),
    },
  ];

  const handleOpenFeesAcquired = (tenant: string, uuid: string) => {
    setSelectedAcquirer({ name: tenant, uuid });
    setOpenFeesDialog(true);
  };

  return (
    <>
      <DataTable data={items} columns={columns} itemsPerPage={9} emptyMessage="Nenhum dado encontrado" />

      <FeesAcquired open={openFeesDialog} onOpenChange={setOpenFeesDialog} acquirer={selectedAcquirer?.name} />
    </>
  );
}
