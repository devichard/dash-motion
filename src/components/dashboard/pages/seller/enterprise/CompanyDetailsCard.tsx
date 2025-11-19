"use client";

import { motion } from "framer-motion";
import { BarChart3, Briefcase, Globe, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterpriseService } from "@/lib/api/enterprise-service";
import type { Enterprise } from "@/types/enterprise";

export default function CompanyDetailsCard({ enterprise }: { enterprise: Enterprise }) {
  const [formData, setFormData] = useState({
    faturamentoMedio: enterprise.averageRevenue,
    ticketMedio: enterprise.averageTicket,
    produtos: enterprise.productsServices,
    site: enterprise.website || "",
  });

  const [originalData, setOriginalData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

    if (!isChanged) {
      return toast.info("Nenhuma alteração detectada.");
    }

    try {
      const payload = {
        averageRevenue: Number(formData.faturamentoMedio),
        averageTicket: Number(formData.ticketMedio),
        productsServices: formData.produtos,
        website: formData.site?.trim() ? formData.site : null,
      };

      const response = await enterpriseService.update(enterprise.id, payload);
      if (response.success) {
        toast.success("Informações atualizadas com sucesso!");
        setOriginalData(formData);
        setIsEditing(false);
      } else {
        toast.error(response.errorMessage || "Erro ao atualizar informações.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro inesperado.");
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="rounded-2xl shadow-sm border border-border/50">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <BarChart3 className="text-[#74B816]" />
            Detalhes da Empresa
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center gap-1"
            disabled={!!isEditing}
          >
            Editar
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Faturamento médio mensal"
              value={formData.faturamentoMedio.toString()}
              onChange={(v) => handleChange("faturamentoMedio", v)}
              disabled={!isEditing}
              icon={<Briefcase className="w-4 h-4 text-muted-foreground" />}
            />
            <InputGroup
              label="Ticket médio"
              value={formData.ticketMedio.toString()}
              onChange={(v) => handleChange("ticketMedio", v)}
              disabled={!isEditing}
              icon={<ShoppingBag className="w-4 h-4 text-muted-foreground" />}
            />

            <InputGroup
              label="Produtos / Serviços"
              value={formData.produtos}
              onChange={(v) => handleChange("produtos", v)}
              disabled={!isEditing}
            />
            <InputGroup
              label="Site"
              value={formData.site}
              onChange={(v) => handleChange("site", v)}
              disabled={!isEditing}
              icon={<Globe className="w-4 h-4 text-muted-foreground" />}
            />
          </div>

          {isEditing && (
            <motion.div
              className="flex justify-end gap-2 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Salvar alterações
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  disabled,
  icon,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        {icon && <span className="absolute left-2 top-2.5 text-muted-foreground">{icon}</span>}
        <Input
          className={icon ? "pl-8" : ""}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
