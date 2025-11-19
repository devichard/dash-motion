"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { paymentLinksService } from "@/lib/api/payment-links";

interface CreateLinkModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateLinkModal({ open, onClose }: CreateLinkModalProps) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState<number | undefined>();
  const [expirationDays, setExpirationDays] = useState<number>(30);

  const handleConfirm = async () => {
    if (!description || !value) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (value < 10) {
      toast.error("O valor deve ser maior ou igual à R$10,00");
      return;
    }

    try {
      await paymentLinksService.create({
        amount: value,
        description: description,
      });
    } catch (_error) {
      toast.error("Ocorreu algum erro, tente novamente.");
      return;
    }

    toast.success("Link de pagamento criado com sucesso!");
    handleClose();
    window.location.reload();
  };

  const handleClose = () => {
    setDescription("");
    setValue(undefined);
    setExpirationDays(30);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link2 className="text-primary size-5" />
          <DialogTitle className="text-lg font-semibold">Criar novo link de pagamento</DialogTitle>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm text-muted-foreground">
            Crie um link personalizado para receber pagamentos de forma rápida e segura, sem necessidade de integração
            técnica.
          </p>
        </div>

        <div>
          <Label>
            Descrição do link <span className="text-destructive">*</span>
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Curso de React, Consultoria 1h, etc."
            rows={3}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">Esta descrição será exibida na página de checkout</p>
        </div>

        <div>
          <Label>
            Valor <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
            <Input
              type="number"
              value={value ?? ""}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="0,00"
              className="pl-10"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* <div>
          <Label>
            Validade do link (dias) <span className="text-destructive">*</span>
          </Label>
          <Input
            type="number"
            value={expirationDays}
            onChange={(e) => setExpirationDays(Number(e.target.value))}
            placeholder="30"
            min="1"
            max="365"
          />
          <p className="text-xs text-muted-foreground mt-1">
            O link ficará ativo por {expirationDays} dia{expirationDays !== 1 ? "s" : ""}
          </p>
        </div> */}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <p className="text-sm text-blue-400">
            💡 Após criar o link, você poderá copiá-lo e compartilhar com seus clientes por WhatsApp, email ou redes
            sociais.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            disabled={!description || !value || value <= 0 || !expirationDays}
            onClick={handleConfirm}
          >
            Criar link <ArrowRight size={16} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
