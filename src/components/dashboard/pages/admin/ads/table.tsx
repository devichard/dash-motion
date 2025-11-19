"use client";

import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { type Column, DataTable, formatDateTime } from "@/components/ui/data-table";

export interface AdItem {
  uuid: string;
  id: string;
  title: string;
  description: string;
  banner: string;
  expirationDate: Date;
  created: Date;
  status: "Ativo" | "Expirado";
}

const mockAds: AdItem[] = [
  {
    uuid: "1",
    id: "1",
    title: "Promoção Especial",
    description: "Aproveite nossa promoção especial de fim de ano",
    banner: "/img/logo-green-background.png",
    expirationDate: new Date("2024-12-31"),
    created: new Date("2024-01-01"),
    status: "Ativo",
  },
  {
    uuid: "2",
    id: "2",
    title: "Novo Produto",
    description: "Conheça nosso novo produto revolucionário",
    banner: "/img/logo-green-background.png",
    expirationDate: new Date("2024-06-30"),
    created: new Date("2024-02-15"),
    status: "Expirado",
  },
];

export default function TableAds() {
  const [ads] = useState<AdItem[]>(mockAds);

  const getStatusBadgeColor = (status: AdItem["status"]) => {
    switch (status) {
      case "Ativo":
        return "bg-green-500";
      case "Expirado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns: Column<AdItem>[] = [
    {
      header: "Banner",
      accessor: (item) => (
        <div className="flex items-center">
          <Image className="rounded-md object-cover" src={item.banner} width={80} height={50} alt={item.title} />
        </div>
      ),
      className: "px-4",
    },
    {
      header: "Título",
      accessor: (item) => (
        <div>
          <div className="font-medium">{item.title}</div>
          <span className="text-muted-foreground mt-0.5 text-xs line-clamp-2">{item.description}</span>
        </div>
      ),
      className: "px-4",
    },
    {
      header: "Criado em",
      accessor: (item) => formatDateTime(item.created),
    },
    {
      header: "Expira em",
      accessor: (item) => formatDateTime(item.expirationDate),
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
  ];

  const sortFunction = (a: AdItem, b: AdItem) => b.created.getTime() - a.created.getTime();

  return (
    <DataTable
      data={ads}
      columns={columns}
      itemsPerPage={9}
      emptyMessage="Nenhum anúncio encontrado"
      onSort={sortFunction}
    />
  );
}
