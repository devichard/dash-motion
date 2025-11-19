"use client";

import { ExternalLink } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCEP, formatCNPJ, formatCPF } from "@/components/ui/data-table";
import { adminService, type EnterpriseWithUser } from "@/lib/api/admin-service";

export default function EnterpriseDetailsPage() {
  const params = useParams<{ cnpj: string }>();
  const router = useRouter();
  const enterpriseId = params.cnpj; // Agora é o ID da empresa
  const [kycData, setKycData] = useState<EnterpriseWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    async function fetchEnterprise() {
      setLoading(true);
      try {
        const response = await adminService.getEnterpriseById(enterpriseId);

        if (response.success) {
          if (response.data) {
            setKycData(response.data);
          } else {
            toast.error("Dados da empresa não encontrados na resposta.");
            notFound();
          }
        } else {
          toast.error(response.errorMessage || "Erro ao carregar empresa");
          notFound();
        }
      } catch (error) {
        toast.error("Erro ao carregar empresa");
        console.error("Error fetching enterprise:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchEnterprise();
  }, [enterpriseId]);

  const handleApprove = async () => {
    if (!kycData) return;

    setApproving(true);
    try {
      const response = await adminService.approveEnterprise(kycData.id);

      if (response.success) {
        toast.success("Empresa aprovada com sucesso!");
        router.push("/admin/kyc");
      } else {
        toast.error(response.errorMessage || "Erro ao aprovar empresa");
      }
    } catch (error) {
      toast.error("Erro ao aprovar empresa");
      console.error("Error approving enterprise:", error);
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (!kycData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl">Detalhes da Solicitação KYC</h1>
          <p className="text-muted-foreground text-sm">Visualize e gerencie os detalhes da solicitação</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5">
            <span className="size-1.5 rounded-full bg-yellow-500" aria-hidden="true" />
            Em Análise
          </Badge>
          <Button variant="outline" disabled={approving}>
            Reprovar
          </Button>
          <Button variant="primary" onClick={handleApprove} disabled={approving}>
            {approving ? "Aprovando..." : "Aprovar"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Informações da empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">CPF/CNPJ</span>
                <span className="text-sm font-medium text-right">{formatCNPJ(kycData.cnpj)}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Razão social</span>
                <span className="text-sm font-medium text-right">{kycData.companyName}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Nome comercial</span>
                <span className="text-sm font-medium text-right">{kycData.commercialName || kycData.tradeName}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-muted-foreground">Nome na fatura</span>
                <span className="text-sm font-medium text-right">{kycData.invoiceName}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              {kycData.documents?.find((doc) => doc.type === "RG_FRONT") && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xs text-muted-foreground">Documento de identificação (Frente)</span>
                  <a
                    href={kycData.documents.find((doc) => doc.type === "RG_FRONT")?.url}
                    target="_blank"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visualizar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {kycData.documents?.find((doc) => doc.type === "RG_BACK") && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xs text-muted-foreground">Documento de identificação (Verso)</span>
                  <a
                    href={kycData.documents.find((doc) => doc.type === "RG_BACK")?.url}
                    target="_blank"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visualizar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {kycData.documents?.find((doc) => doc.type === "SELFIE_WITH_RG") && (
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xs text-muted-foreground">Selfie com RG</span>
                  <a
                    href={kycData.documents.find((doc) => doc.type === "SELFIE_WITH_RG")?.url}
                    target="_blank"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visualizar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {kycData.documents?.find((doc) => doc.type === "SOCIAL_CONTRACT") && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Contrato Social</span>
                  <a
                    href={kycData.documents.find((doc) => doc.type === "SOCIAL_CONTRACT")?.url}
                    target="_blank"
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Visualizar <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Representante Legal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Nome</span>
                <span className="text-sm font-medium text-right">{kycData.legalRepName}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">E-mail</span>
                <span className="text-sm font-medium text-right">{kycData.legalRepEmail}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">CPF</span>
                <span className="text-sm font-medium text-right">{formatCPF(kycData.legalRepCpf)}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Cargo</span>
                <span className="text-sm font-medium text-right">{kycData.legalRepRole}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Telefone</span>
                <span className="text-sm font-medium text-right">{kycData.legalRepPhone}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Endereço</span>
                <span className="text-sm font-medium text-right max-w-[60%]">
                  {kycData.addressStreet}, {kycData.addressNumber}{" "}
                  {kycData.addressComplement && `- ${kycData.addressComplement}`}
                </span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Bairro</span>
                <span className="text-sm font-medium text-right">{kycData.addressNeighborhood}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Cidade</span>
                <span className="text-sm font-medium text-right">
                  {kycData.addressCity}, {kycData.addressState} - BR
                </span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">CEP</span>
                <span className="text-sm font-medium text-right">{formatCEP(kycData.addressZipCode)}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-muted-foreground">Criado em</span>
                <span className="text-sm font-medium text-right">
                  {new Date(kycData.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  às{" "}
                  {new Date(kycData.createdAt).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Outras informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Faturamento médio</span>
                <span className="text-sm font-medium text-right">
                  {kycData.averageRevenue.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Ticket médio</span>
                <span className="text-sm font-medium text-right">
                  {kycData.averageTicket.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Produtos/Serviços</span>
                <span className="text-sm font-medium text-right">{kycData.productsServices}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Website</span>
                <span className="text-sm font-medium text-right">{kycData.website || "Não informado"}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">E-mail de contato</span>
                <span className="text-sm font-medium text-right">{kycData.contactEmail}</span>
              </div>
              <div className="flex justify-between items-start border-b pb-2">
                <span className="text-xs text-muted-foreground">Telefone de contato</span>
                <span className="text-sm font-medium text-right">{kycData.contactPhone}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-xs text-muted-foreground">Vende produtos físicos?</span>
                <span className="text-sm font-medium text-right">{kycData.sellsPhysicalProducts ? "Sim" : "Não"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
