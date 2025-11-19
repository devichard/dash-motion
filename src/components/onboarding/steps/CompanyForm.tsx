"use client";

import { Building2, Globe, IdCard, Mail, MapPin, Search, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { PublicaCnpjService } from "@/lib/api/cnpj-service";
import { enterpriseService } from "@/lib/api/enterprise-service";
import { companySchema } from "@/lib/validations/company";
import type { NewEnterpriseData } from "@/types/enterprise";

export default function CompleteCompanyForm({
  onNext,
  onPrev,
}: {
  onNext: (data: NewEnterpriseData) => void;
  onPrev: () => void;
}) {
  const [form, setForm] = useState({
    commercialName: "",
    invoiceName: "",
    averageRevenue: "",
    averageTicket: "",
    productsServices: "",
    website: "",
    contactEmail: "",
    contactPhone: "",
    sellsPhysicalProducts: false,
    cnpj: "",
    companyName: "",
    tradeName: "",
    phone: "",
    email: "",
    addressZipCode: "",
    addressStreet: "",
    addressNumber: "",
    addressComplement: "",
    addressNeighborhood: "",
    addressCity: "",
    addressState: "",

    responsavelNome: "",
    responsavelCpf: "",
    responsavelCargo: "",
    responsavelEntrada: "",
    responsavelTelefone: "",
    responsavelEmail: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cnpjLocked, setCnpjLocked] = useState(false);

  async function handleCnpjBlur() {
    const cleanCnpj = form.cnpj.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) return;

    setLoadingCnpj(true);
    setCnpjError(null);

    const service = new PublicaCnpjService();
    const result = await service.fetchDataByCnpj(cleanCnpj);

    setLoadingCnpj(false);

    if (!result.success) {
      setCnpjError(result.message);
      return;
    }

    setForm((prev) => ({
      ...prev,
      companyName: result.companyName,
      tradeName: result.tradeName,
      phone: result.phone,
      email: result.email,
      addressZipCode: result.address.zip,
      addressStreet: result.address.street,
      addressNumber: result.address.number,
      addressComplement: result.address.complement || "",
      addressNeighborhood: result.address.neighborhood,
      addressCity: result.address.city,
      addressState: result.address.state,
    }));

    setCnpjLocked(true);
  }

  function validate() {
    const result = companySchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {};

      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (typeof path === "string") fieldErrors[path] = issue.message;
      });

      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload: NewEnterpriseData = {
        commercialName: form.commercialName,
        invoiceName: form.invoiceName,
        averageRevenue: Number(form.averageRevenue),
        averageTicket: Number(form.averageTicket),
        productsServices: form.productsServices,
        website: form.website || null,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        sellsPhysicalProducts: form.sellsPhysicalProducts,
        cnpj: form.cnpj,
        companyName: form.companyName,
        tradeName: form.tradeName,
        phone: form.phone,
        email: form.email,
        addressZipCode: form.addressZipCode,
        addressStreet: form.addressStreet,
        addressNumber: form.addressNumber,
        addressComplement: form.addressComplement || null,
        addressNeighborhood: form.addressNeighborhood,
        addressCity: form.addressCity,
        addressState: form.addressState,

        legalRepName: form.responsavelNome,
        legalRepCpf: form.responsavelCpf,
        legalRepRole: form.responsavelCargo,
        legalRepStartDate: new Date(form.responsavelEntrada),
        legalRepPhone: form.responsavelTelefone,
        legalRepEmail: form.responsavelEmail,
      };

      const response = await enterpriseService.create(payload);

      if (!response.success) {
        console.error("Erro ao criar empresa:", response.errorMessage);
        alert(response.errorMessage || "Erro ao enviar os dados. Verifique as informações e tente novamente.");
        return;
      }

      onNext(response.data);
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Falha na conexão com o servidor. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  }

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .slice(0, 14);
    } else {
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .slice(0, 15);
    }
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  return (
    <div className="relative lg:mt-0 mt-10 w-screen h-screen grid place-items-center overflow-y-auto px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-sm rounded-2xl p-8 shadow-xl w-full lg:max-w-6xl max-w-4xl space-y-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <IdCard className="w-5 h-5 text-[#74B816]" />
                CNPJ da Empresa
              </h3>
              <div className="relative">
                <Input
                  placeholder="00.000.000/0000-00"
                  value={formatCNPJ(form.cnpj)}
                  onChange={(e) => setForm({ ...form, cnpj: e.target.value.replace(/\D/g, "") })}
                  onBlur={handleCnpjBlur}
                  className={`pl-10 pr-4 py-3 text-base ${
                    errors.cnpj ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              {loadingCnpj && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 border-2 border-[#74B816] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-600 text-sm">Buscando dados da empresa...</p>
                </div>
              )}
              {cnpjError && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {cnpjError}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#74B816]" />
                Informações da Empresa
              </h3>
              <div className="space-y-4">
                {cnpjLocked && (
                  <button
                    type="button"
                    className="text-sm text-[#74B816] hover:underline"
                    onClick={() => setCnpjLocked(false)}
                  >
                    Editar dados
                  </button>
                )}
                <Input
                  placeholder="Razão Social"
                  value={form.companyName}
                  disabled={cnpjLocked}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className={errors.companyName ? "border-red-500" : ""}
                />
                <Input
                  placeholder="Nome Fantasia"
                  value={form.tradeName}
                  disabled={cnpjLocked}
                  onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
                  className={errors.tradeName ? "border-red-500" : ""}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Telefone"
                    value={formatPhone(form.phone)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  <Input
                    placeholder="E-mail"
                    type="email"
                    value={form.email}
                    disabled={cnpjLocked}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#74B816]" />
                Informações Comerciais
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Nome Comercial"
                  value={form.commercialName}
                  onChange={(e) => setForm({ ...form, commercialName: e.target.value })}
                  className={errors.commercialName ? "border-red-500" : ""}
                />
                <Input
                  placeholder="Nome de Fatura"
                  value={form.invoiceName}
                  onChange={(e) => setForm({ ...form, invoiceName: e.target.value })}
                  className={errors.invoiceName ? "border-red-500" : ""}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Receita Média (R$)"
                    type="number"
                    value={form.averageRevenue}
                    onChange={(e) => setForm({ ...form, averageRevenue: e.target.value })}
                    className={errors.averageRevenue ? "border-red-500" : ""}
                  />
                  <Input
                    placeholder="Ticket Médio (R$)"
                    type="number"
                    value={form.averageTicket}
                    onChange={(e) => setForm({ ...form, averageTicket: e.target.value })}
                    className={errors.averageTicket ? "border-red-500" : ""}
                  />
                </div>
                <Input
                  placeholder="Produtos/Serviços"
                  value={form.productsServices}
                  onChange={(e) => setForm({ ...form, productsServices: e.target.value })}
                  className={errors.productsServices ? "border-red-500" : ""}
                />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#74B816]" />
                Contato
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Website (opcional)"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                />
                <Input
                  placeholder="E-mail de Contato"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className={errors.contactEmail ? "border-red-500" : ""}
                />
                <Input
                  placeholder="Telefone de Contato"
                  value={formatPhone(form.contactPhone)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contactPhone: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={errors.contactPhone ? "border-red-500" : ""}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#74B816]" />
                Endereço
              </h3>
              <div className="space-y-4">
                {cnpjLocked && (
                  <button
                    type="button"
                    className="text-sm text-[#74B816] hover:underline"
                    onClick={() => setCnpjLocked(false)}
                  >
                    Editar dados
                  </button>
                )}
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="CEP"
                    value={formatCEP(form.addressZipCode)}
                    disabled={cnpjLocked}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        addressZipCode: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={errors.addressZipCode ? "border-red-500" : ""}
                  />
                  <div className="col-span-2">
                    <Input
                      placeholder="Logradouro"
                      disabled={cnpjLocked}
                      value={form.addressStreet}
                      onChange={(e) => setForm({ ...form, addressStreet: e.target.value })}
                      className={errors.addressStreet ? "border-red-500" : ""}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Número"
                    disabled={cnpjLocked}
                    value={form.addressNumber}
                    onChange={(e) => setForm({ ...form, addressNumber: e.target.value })}
                    className={errors.addressNumber ? "border-red-500" : ""}
                  />
                  <div className="col-span-2">
                    <Input
                      placeholder="Complemento"
                      value={form.addressComplement}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          addressComplement: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <Input
                  placeholder="Bairro"
                  disabled={cnpjLocked}
                  value={form.addressNeighborhood}
                  onChange={(e) => setForm({ ...form, addressNeighborhood: e.target.value })}
                  className={errors.addressNeighborhood ? "border-red-500" : ""}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Cidade"
                    disabled={cnpjLocked}
                    value={form.addressCity}
                    onChange={(e) => setForm({ ...form, addressCity: e.target.value })}
                    className={errors.addressCity ? "border-red-500" : ""}
                  />
                  <Input
                    placeholder="UF"
                    disabled={cnpjLocked}
                    value={form.addressState}
                    onChange={(e) => setForm({ ...form, addressState: e.target.value })}
                    className={errors.addressState ? "border-red-500" : ""}
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#74B816]" />
                Dados do Responsável
              </h3>
              <div className="space-y-4">
                <Input
                  placeholder="Nome Completo"
                  value={form.responsavelNome}
                  onChange={(e) => setForm({ ...form, responsavelNome: e.target.value })}
                  className={errors.responsavelNome ? "border-red-500" : ""}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="CPF"
                    value={formatCPF(form.responsavelCpf)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        responsavelCpf: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={errors.responsavelCpf ? "border-red-500" : ""}
                  />
                  <Input
                    placeholder="Cargo"
                    value={form.responsavelCargo}
                    onChange={(e) => setForm({ ...form, responsavelCargo: e.target.value })}
                    className={errors.responsavelCargo ? "border-red-500" : ""}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Data de Entrada"
                    type="date"
                    value={form.responsavelEntrada}
                    onChange={(e) => setForm({ ...form, responsavelEntrada: e.target.value })}
                    className={errors.responsavelEntrada ? "border-red-500" : ""}
                  />
                  <Input
                    placeholder="Telefone"
                    value={formatPhone(form.responsavelTelefone)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        responsavelTelefone: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className={errors.responsavelTelefone ? "border-red-500" : ""}
                  />
                </div>

                <Input
                  placeholder="E-mail"
                  type="email"
                  value={form.responsavelEmail}
                  onChange={(e) => setForm({ ...form, responsavelEmail: e.target.value })}
                  className={errors.responsavelEmail ? "border-red-500" : ""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-10">
          <Button type="button" variant="outline" className="flex-1" onClick={onPrev} disabled={loading}>
            Voltar
          </Button>
          <Button type="submit" variant="primary" className="flex-1 bg-[#74B816] hover:bg-[#66A80F]" disabled={loading}>
            {loading ? "Enviando" : "Continuar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
