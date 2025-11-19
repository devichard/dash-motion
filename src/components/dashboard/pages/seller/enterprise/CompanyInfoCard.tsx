"use client";

import { motion } from "framer-motion";
import { Building2, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { enterpriseService } from "@/lib/api/enterprise-service";
import type { Enterprise } from "@/types/enterprise";

export default function CompanyInfoCard({ enterprise }: { enterprise: Enterprise }) {
  const [formData, setFormData] = useState({
    razaoSocial: enterprise.companyName,
    nomeFantasia: enterprise.tradeName,
    cnpj: enterprise.cnpj,
    telefone: enterprise.phone,
    email: enterprise.email,
    cep: enterprise.addressZipCode,
    rua: enterprise.addressStreet,
    numero: enterprise.addressNumber,
    complemento: enterprise.addressComplement ?? "",
    bairro: enterprise.addressNeighborhood,
    cidade: enterprise.addressCity,
    uf: enterprise.addressState,
    representante: enterprise.legalRepName,
    cpfRepresentante: enterprise.legalRepCpf,
    cargoRepresentante: enterprise.legalRepRole,
    emailRepresentante: enterprise.legalRepEmail,
  });

  const [originalData, setOriginalData] = useState(formData);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const isChanged = JSON.stringify(formData) !== JSON.stringify(originalData);

    if (!isChanged) {
      return toast.info("Nenhuma alteração detectada.");
    }

    try {
      const payload = {
        companyName: formData.razaoSocial,
        tradeName: formData.nomeFantasia,
        phone: formData.telefone,
        email: formData.email,
        addressZipCode: formData.cep,
        addressStreet: formData.rua,
        addressNumber: formData.numero,
        addressComplement: formData.complemento || null,
        addressNeighborhood: formData.bairro,
        addressCity: formData.cidade,
        addressState: formData.uf,
        legalRepName: formData.representante,
        legalRepCpf: formData.cpfRepresentante,
        legalRepRole: formData.cargoRepresentante,
        legalRepEmail: formData.emailRepresentante,
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
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="rounded-2xl shadow-sm border border-border/50 transition-all">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Building2 className="text-[#74B816]" />
            Informações da Empresa
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
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup
                label="Razão Social"
                value={formData.razaoSocial}
                onChange={(v) => handleChange("razaoSocial", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="Nome Fantasia"
                value={formData.nomeFantasia}
                onChange={(v) => handleChange("nomeFantasia", v)}
                disabled={!isEditing}
              />
              <InputGroup label="CNPJ" value={formData.cnpj} disabled />
              <InputGroup
                label="Telefone"
                value={formData.telefone}
                onChange={(v) => handleChange("telefone", v)}
                disabled={!isEditing}
                icon={<Phone className="h-4 w-4 text-muted-foreground" />}
              />
              <InputGroup
                label="E-mail"
                value={formData.email}
                onChange={(v) => handleChange("email", v)}
                disabled={!isEditing}
                icon={<Mail className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputGroup
                label="CEP"
                value={formData.cep}
                onChange={(v) => handleChange("cep", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="Rua"
                value={formData.rua}
                onChange={(v) => handleChange("rua", v)}
                disabled={!isEditing}
                className="md:col-span-2"
              />
              <InputGroup
                label="Número"
                value={formData.numero}
                onChange={(v) => handleChange("numero", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="Complemento"
                value={formData.complemento}
                onChange={(v) => handleChange("complemento", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="Bairro"
                value={formData.bairro}
                onChange={(v) => handleChange("bairro", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="Cidade"
                value={formData.cidade}
                onChange={(v) => handleChange("cidade", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="UF"
                value={formData.uf}
                onChange={(v) => handleChange("uf", v)}
                disabled={!isEditing}
                maxLength={2}
              />
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4 text-[#74B816]" />
              Representante legal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputGroup
                label="Nome completo"
                value={formData.representante}
                onChange={(v) => handleChange("representante", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="CPF"
                value={formData.cpfRepresentante}
                onChange={(v) => handleChange("cpfRepresentante", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="Cargo"
                value={formData.cargoRepresentante}
                onChange={(v) => handleChange("cargoRepresentante", v)}
                disabled={!isEditing}
              />
              <InputGroup
                label="Email"
                value={formData.emailRepresentante}
                onChange={(v) => handleChange("emailRepresentante", v)}
                disabled={!isEditing}
              />
            </div>
          </section>

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
  className,
  icon,
  maxLength,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  maxLength?: number;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="relative">
        {icon && <span className="absolute left-2 top-2.5 text-muted-foreground">{icon}</span>}
        <Input
          className={icon ? "pl-8" : ""}
          value={value}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
