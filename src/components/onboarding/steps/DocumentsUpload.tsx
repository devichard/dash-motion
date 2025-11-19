"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { enterpriseService } from "@/lib/api/enterprise-service";
import { DocumentType } from "@/types/enterprise";

export default function DocumentsUpload({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }) {
  const [documentType, setDocumentType] = useState<"RG" | "CNH" | "">("");
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [socialContract, setSocialContract] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!socialContract) {
      alert("O contrato social é obrigatório!");
      return;
    }

    if (!documentType || !front || !back || !selfie) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      const files: Record<DocumentType, File> = {
        [DocumentType.SOCIAL_CONTRACT]: socialContract,
        [DocumentType.RG_FRONT]: front,
        [DocumentType.RG_BACK]: back,
        [DocumentType.SELFIE_WITH_RG]: selfie,
      };

      const enterpriseId = localStorage.getItem("enterpriseId");

      if (!enterpriseId) {
        alert("ID da empresa não encontrado!");
        return;
      }

      const response = await enterpriseService.uploadDocuments(enterpriseId, files);

      if (!response.success) {
        alert(response.errorMessage || "Erro ao enviar documentos. Tente novamente.");
        return;
      }

      alert("Documentos enviados com sucesso!");
      onNext();
    } catch (error) {
      console.error(error);
      alert("Erro inesperado ao enviar os documentos.");
    }
  }

  return (
    <div className="relative w-screen lg:mt-0 mt-10 h-screen grid place-items-center overflow-y-auto px-4 py-10">
      <form onSubmit={handleSubmit} className="backdrop-blur-sm rounded-2xl p-8 shadow-xl w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-[#74B816]">Envie seus documentos</h2>
          <p className="text-muted-foreground text-sm">
            Precisamos dos documentos da empresa e do responsável legal para validar seu cadastro.
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <Label className="text-lg font-medium">Contrato Social</Label>
          <p className="text-sm text-muted-foreground">Formatos aceitos: .pdf</p>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => setSocialContract(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground 
                       file:mr-4 file:rounded-md file:border-0 
                       file:bg-[#74B816] file:px-3 file:py-1.5 
                       file:text-white hover:file:bg-[#66A80F] cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Documento</Label>
          <Select onValueChange={(val) => setDocumentType(val as "RG" | "CNH")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo de documento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RG">RG</SelectItem>
              <SelectItem value="CNH">CNH</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(documentType === "RG" || documentType === "CNH") && (
          <div className="grid gap-8 sm:gap-10">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col space-y-2">
                <Label className="text-lg font-medium">Frente</Label>
                <p className="text-sm text-muted-foreground">Formatos aceitos: .jpeg / .png</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFront(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-muted-foreground 
                     file:mr-4 file:rounded-md file:border-0 
                     file:bg-[#74B816] file:px-4 file:py-2 
                     file:text-white hover:file:bg-[#66A80F] cursor-pointer"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="text-lg font-medium">Verso</Label>
                <p className="text-sm text-muted-foreground">Formatos aceitos: .jpeg / .png</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBack(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-muted-foreground 
                     file:mr-4 file:rounded-md file:border-0 
                     file:bg-[#74B816] file:px-4 file:py-2 
                     file:text-white hover:file:bg-[#66A80F] cursor-pointer"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <Label className="text-lg font-medium">Selfie com Documento</Label>
                <p className="text-sm text-muted-foreground">Formatos aceitos: .jpeg / .png</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-muted-foreground 
                   file:mr-4 file:rounded-md file:border-0 
                   file:bg-[#74B816] file:px-4 file:py-2 
                   file:text-white hover:file:bg-[#66A80F] cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8">
          <Button type="button" variant="outline" className="flex-1" onClick={onPrev}>
            Voltar
          </Button>
          <Button type="submit" variant="primary" className="flex-1 bg-[#74B816] hover:bg-[#66A80F]">
            Enviar documentos
          </Button>
        </div>
      </form>
    </div>
  );
}
