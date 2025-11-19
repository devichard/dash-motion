"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CreateAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAdDialog({ open, onOpenChange }: CreateAdDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Por favor, selecione uma imagem no formato JPG, JPEG ou PNG");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }

      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Por favor, preencha o título");
      return;
    }

    if (!description.trim()) {
      toast.error("Por favor, preencha a descrição");
      return;
    }

    if (!banner) {
      toast.error("Por favor, selecione um banner");
      return;
    }

    if (!expirationDate) {
      toast.error("Por favor, selecione a data de expiração");
      return;
    }

    if (expirationDate < new Date()) {
      toast.error("A data de expiração deve ser futura");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Anúncio criado com sucesso!");
      handleClose();
    } catch (error) {
      toast.error("Erro ao criar anúncio. Tente novamente.");
      console.error("Error creating ad:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setBanner(null);
    setBannerPreview("");
    setExpirationDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Anúncio</DialogTitle>
          <DialogDescription>Preencha as informações abaixo para criar um novo anúncio na plataforma</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              placeholder="Digite o título do anúncio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Digite a descrição do anúncio"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="banner">Banner *</Label>
            <div className="space-y-2">
              <Input
                id="banner"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleBannerChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">Formatos aceitos: JPG, JPEG, PNG (máx. 5MB)</p>
              {bannerPreview && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <Image
                    src={bannerPreview}
                    alt="Preview do banner"
                    width={300}
                    height={150}
                    className="rounded-md border object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data de Expiração *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expirationDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expirationDate ? (
                    format(expirationDate, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data de expiração</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expirationDate}
                  onSelect={setExpirationDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
