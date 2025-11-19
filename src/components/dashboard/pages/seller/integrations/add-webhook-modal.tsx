"use client";

import { Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Webhook {
  id: string;
  url: string;
  type: string;
  createdAt: string;
}

interface AddWebhookModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (webhook: Webhook) => void;
}

export default function AddWebhookModal({ open, onClose, onSuccess }: AddWebhookModalProps) {
  const [url, setUrl] = useState("");
  const [type, setType] = useState<string>("");

  const handleConfirm = () => {
    if (!url || !type) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      new URL(url);
    } catch {
      toast.error("URL inválida");
      return;
    }

    const newWebhook: Webhook = {
      id: Date.now().toString(),
      url,
      type,
      createdAt: new Date().toISOString(),
    };

    toast.success("Webhook adicionado com sucesso!");
    handleClose();
    onSuccess(newWebhook);
  };

  const handleClose = () => {
    setUrl("");
    setType("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg p-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-primary" />
          <DialogTitle className="text-lg font-semibold">Adicionar Webhook</DialogTitle>
        </div>

        <div className="space-y-4">
          <div>
            <Label>URL</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <LinkIcon className="h-4 w-4" />
              </div>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Digite a URL"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label>Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha o tipo do webhook" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transaction_created_updated">
                  Criação/atualização de transações
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!url || !type}
          >
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

