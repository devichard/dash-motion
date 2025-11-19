"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CompanyDetailsCard from "@/components/dashboard/pages/seller/enterprise/CompanyDetailsCard";
import CompanyDocumentsCard from "@/components/dashboard/pages/seller/enterprise/CompanyDocumentsCard";
import CompanyInfoCard from "@/components/dashboard/pages/seller/enterprise/CompanyInfoCard";
import { enterpriseService } from "@/lib/api/enterprise-service";
import type { Enterprise } from "@/types/enterprise";

export default function EnterpriseSeller() {
  const [enterprise, setEnterprise] = useState<Enterprise | null>(null);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const fetchEnterprise = async () => {
      setIsloading(true);
      try {
        const response = await enterpriseService.get();
        if (response.success) {
          const data = Array.isArray(response.data) ? response.data[0] : response.data;
          setEnterprise(data);
        } else {
          toast.error(response.errorMessage || "Erro ao buscar informações da empresa.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro inesperado ao carregar dados da empresa.");
      } finally {
        setIsloading(false);
      }
    };

    fetchEnterprise();
  }, []);

  if (isLoading) return <p className="text-center text-muted-foreground py-8">Carregando...</p>;

  if (!enterprise) return <p className="text-center text-destructive py-8">Empresa não encontrada.</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Minha Empresa</h1>
          <p className="text-muted-foreground text-sm">Veja as informações principais da sua empresa</p>
        </div>
      </div>
      <div className="mt-6 space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <CompanyInfoCard enterprise={enterprise} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <CompanyDetailsCard enterprise={enterprise} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        >
          <CompanyDocumentsCard enterprise={enterprise} />
        </motion.div>
      </div>
    </div>
  );
}
