"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { type Column, DataTable, formatCNPJ, formatCurrency, formatDateTime } from "@/components/ui/data-table";
import { adminService, type EnterpriseWithUser } from "@/lib/api/admin-service";

export interface KycItem {
  id: string;
  uuid: string;
  image: string;
  enterprise: string;
  cnpj: string;
  invoicing: number;
  created: Date;
  status: "Em Análise" | "Aprovado" | "Recusado";
  user?: {
    email: string;
    approved: boolean;
  };
}

interface TableEmployeesProps {
  statusFilter: string;
  searchQuery: string;
}

export default function TableEmployees({ statusFilter, searchQuery }: TableEmployeesProps) {
  const [data, setData] = useState<KycItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEnterprises() {
      setLoading(true);
      try {
        const response = await adminService.getEnterprisesRequest(1, 10);

        console.log("API Response:", response);

        if (response.success) {
          if (response.data) {
            let enterprises: EnterpriseWithUser[] = [];

            if (Array.isArray(response.data)) {
              enterprises = response.data;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              enterprises = response.data.data;
            } else {
              console.error("Formato de resposta inesperado:", response.data);
              toast.error("Formato de resposta inesperado da API");
              setLoading(false);
              return;
            }

            console.log("Enterprises encontradas:", enterprises.length);

            const mappedData: KycItem[] = enterprises.map((enterprise: EnterpriseWithUser) => ({
              id: enterprise.id,
              uuid: enterprise.id,
              image: "/img/logo-green-background.png",
              enterprise: enterprise.commercialName || enterprise.companyName,
              cnpj: formatCNPJ(enterprise.cnpj),
              invoicing: enterprise.averageRevenue,
              created: new Date(enterprise.createdAt),
              status: enterprise.user?.approved ? "Aprovado" : "Em Análise",
              user: enterprise.user,
            }));
            setData(mappedData);
          } else {
            toast.error("Dados não encontrados na resposta da API");
          }
        } else {
          toast.error(response.errorMessage || "Erro ao carregar solicitações KYC");
        }
      } catch (error) {
        toast.error("Erro ao carregar solicitações KYC");
        console.error("Error fetching enterprises:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEnterprises();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }
  const columns: Column<KycItem>[] = [
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
      header: "Faturamento médio",
      accessor: (item) => formatCurrency(item.invoicing),
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
            className={`size-1.5 rounded-full ${
              item.status === "Em Análise"
                ? "bg-yellow-500"
                : item.status === "Aprovado"
                  ? "bg-green-500"
                  : "bg-red-500"
            }`}
            aria-hidden="true"
          ></span>
          {item.status}
        </Badge>
      ),
    },
    {
      header: "Ação",
      accessor: (item) => (
        <Link className="justify-end flex" href={`/admin/kyc/${item.id}`}>
          <Eye className="text-muted-foreground hover:text-foreground size-5 mr-2" />
        </Link>
      ),
      className: "px-4 text-right",
    },
  ];

  const filterFunction = (item: KycItem) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.enterprise.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.cnpj.includes(searchQuery);
    return matchesStatus && matchesSearch;
  };

  const sortFunction = (a: KycItem, b: KycItem) => b.created.getTime() - a.created.getTime();

  return (
    <DataTable
      data={data}
      columns={columns}
      itemsPerPage={9}
      emptyMessage="Nenhuma solicitação encontrada"
      onFilter={filterFunction}
      onSort={sortFunction}
    />
  );
}
