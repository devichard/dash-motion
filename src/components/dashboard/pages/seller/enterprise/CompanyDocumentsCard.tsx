"use client";

import { motion } from "framer-motion";
import { FileText, Lock, Unlock, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enterpriseService } from "@/lib/api/enterprise-service";
import type { Enterprise } from "@/types/enterprise";
import { DocumentType } from "@/types/enterprise";

export default function CompanyDocumentsCard({ enterprise }: { enterprise: Enterprise }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loadingKey, setLoadingkey] = useState<string | null>(null);

  const [docs, setDocs] = useState<Record<DocumentType, string>>({
    [DocumentType.SOCIAL_CONTRACT]:
      enterprise.documents.find((d) => d.type === DocumentType.SOCIAL_CONTRACT)?.url || "",
    [DocumentType.RG_FRONT]: enterprise.documents.find((d) => d.type === DocumentType.RG_FRONT)?.url || "",
    [DocumentType.RG_BACK]: enterprise.documents.find((d) => d.type === DocumentType.RG_BACK)?.url || "",
    [DocumentType.SELFIE_WITH_RG]: enterprise.documents.find((d) => d.type === DocumentType.SELFIE_WITH_RG)?.url || "",
  });

  const handleUpload = async (key: keyof typeof docs, file: File) => {
    try {
      setLoadingkey(key);
      toast.info(`Enviando ${file.name}`);

      const response = await enterpriseService.updateDocument(enterprise.id, key, file);

      if (response.success) {
        toast.success(`${docLabels[key]} atualizado com sucesso!`);
        setDocs((prev) => ({ ...prev, [key]: file.name }));
      } else {
        toast.error(response.errorMessage || "Erro ao atualizar documento.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao enviar documento.");
    } finally {
      setLoadingkey(null);
    }
  };

  const docLabels: Record<keyof typeof docs, string> = {
    SOCIAL_CONTRACT: "Contrato Social",
    RG_FRONT: "Documento (Frente)",
    RG_BACK: "Documento (Verso)",
    SELFIE_WITH_RG: "Selfie com Documento",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="rounded-2xl shadow-sm border border-border/50">
        <CardHeader className="flex justify-between items-center pb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <FileText className="text-[#74B816]" />
            Documentos
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing((prev) => !prev)}
            className="flex items-center gap-1"
          >
            {isEditing ? (
              <>
                <Lock size={14} /> Concluir
              </>
            ) : (
              <>
                <Unlock size={14} /> Editar
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="space-y-5">
          {Object.entries(docs).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center border rounded-lg px-4 py-3">
              <span className="text-sm font-medium">{docLabels[key as keyof typeof docs]}</span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-sm truncate max-w-[160px]">{value || "Não enviado"}</span>
                {isEditing && (
                  <label className="cursor-pointer flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleUpload(key as keyof typeof docs, e.target.files[0])}
                    />
                    {loadingKey === key ? "Enviando..." : "Enviar"}
                  </label>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
