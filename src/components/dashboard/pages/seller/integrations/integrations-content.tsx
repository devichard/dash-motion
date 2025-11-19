"use client";

import { AlertTriangle, Copy, ExternalLink, Eye, EyeOff, Key, Plus, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { integrationsService } from "@/lib/api/integrations-service";
import type { IntegrationKeys } from "@/types/integrations";
import AddWebhookModal from "./add-webhook-modal";

interface Webhook {
  id: string;
  url: string;
  type: string;
  createdAt: string;
}

const WEBHOOKS_STORAGE_KEY = "seller_webhooks";

export default function IntegrationsContent() {
  const [keys, setKeys] = useState<IntegrationKeys | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [webhookToDelete, setWebhookToDelete] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await integrationsService.getKeys();
      if (response.success) {
        setKeys(response.data);
      } else {
        toast.error("Erro ao carregar credenciais");
      }
    } catch (error) {
      console.error("Error fetching keys:", error);
      toast.error("Erro ao carregar credenciais");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadWebhooks = useCallback(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(WEBHOOKS_STORAGE_KEY);
      if (stored) {
        try {
          setWebhooks(JSON.parse(stored));
        } catch {
          setWebhooks([]);
        }
      }
    }
  }, []);

  const saveWebhooks = useCallback((webhooksList: Webhook[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(WEBHOOKS_STORAGE_KEY, JSON.stringify(webhooksList));
      setWebhooks(webhooksList);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
    loadWebhooks();
  }, [fetchKeys, loadWebhooks]);

  const handleAddWebhook = (webhook: Webhook) => {
    const updatedWebhooks = [...webhooks, webhook];
    saveWebhooks(updatedWebhooks);
  };

  const handleDeleteWebhook = (id: string) => {
    const updatedWebhooks = webhooks.filter((w) => w.id !== id);
    saveWebhooks(updatedWebhooks);
    setWebhookToDelete(null);
    toast.success("Webhook deletado com sucesso!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };

  const getWebhookTypeLabel = (type: string) => {
    if (type === "transaction_created_updated") {
      return "Criação/Atualização de Transações";
    }
    return type;
  };

  const handleResetKeys = async () => {
    setIsResetting(true);
    try {
      const response = await integrationsService.updateKeys();
      if (response.success) {
        setKeys(response.data);
        toast.success("Chaves redefinidas com sucesso!");
        setOpenResetDialog(false);
        setShowPrivateKey(false);
      } else {
        toast.error("Erro ao redefinir chaves");
      }
    } catch (error) {
      console.error("Error resetting keys:", error);
      toast.error("Erro ao redefinir chaves");
    } finally {
      setIsResetting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiada para a área de transferência!`);
  };

  const maskKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 8) return "•".repeat(key.length);
    return key.substring(0, 4) + "•".repeat(key.length - 8) + key.substring(key.length - 4);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Carregando credenciais...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Credenciais de API</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Essas chaves são responsáveis pela autenticação de sua API. Utilize-as para integrar aos seus checkouts, ou
            outros serviços de terceiros.
          </p>
          <Link
            href="https://documenter.getpostman.com/view/1829392/2sB3Wqv1QT"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            onClick={(e) => {
              e.preventDefault();
              toast.info("Abrindo documentação em uma nova aba");
              window.open("https://documenter.getpostman.com/view/1829392/2sB3Wqv1QT", "_blank");
            }}
          >
            Ver documentação <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <Card className="rounded-xl border">
          <CardContent className="p-6 space-y-6">
            {/* Aviso de Segurança */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-500 mb-1">Mantenha essas chaves em segredo!</p>
                <p className="text-xs text-muted-foreground">
                  Essas chaves são responsáveis pela autenticação de sua API e permitem acesso aos dados de sua empresa,
                  suas vendas e seus clientes. Não divulgue-as!
                </p>
              </div>
            </div>

            {/* Chave Privada */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                Chave Privada:
              </Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={showPrivateKey ? keys?.privateKey || "" : maskKey(keys?.privateKey || "")}
                    readOnly
                    className="font-mono text-sm pr-20"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs"
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                  >
                    {showPrivateKey ? (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Revelar
                      </>
                    )}
                  </Button>
                </div>
                {keys?.privateKey && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => copyToClipboard(keys.privateKey, "Chave privada")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Chave Pública */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                Chave Pública:
              </Label>
              <div className="flex items-center gap-2">
                <Input type="text" value={keys?.publicKey || ""} readOnly className="font-mono text-sm flex-1" />
                {keys?.publicKey && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => copyToClipboard(keys.publicKey, "Chave pública")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Botão Redefinir Chaves */}
            <div className="flex justify-end pt-4 border-t">
              <Button variant="destructive" onClick={() => setOpenResetDialog(true)} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Redefinir Chaves
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de Confirmação para Redefinir Chaves */}
      <AlertDialog open={openResetDialog} onOpenChange={setOpenResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir Chaves de API</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja redefinir suas chaves de API? Esta ação irá invalidar as chaves atuais e gerar
              novas chaves. Qualquer integração que esteja usando as chaves antigas deixará de funcionar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetKeys}
              disabled={isResetting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isResetting ? "Redefinindo..." : "Sim, Redefinir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* seção webhook*/}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Webhooks</h2>
            <p className="text-sm text-muted-foreground">
              Aqui você pode gerenciar seus webhooks conectados, criá-los ou deleta-los. Adicione webhooks para se
              conectar a aplicações de terceiros! Esses webhooks notificarão eventos de criação/atualização de
              transações.
            </p>
          </div>
        </div>

        <Card className="rounded-xl border">
          <CardContent className="p-6">
            {webhooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum webhook cadastrado. Clique em "Adicionar Webhook" para começar.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>URL</TableHead>
                    <TableHead>CRIADO EM</TableHead>
                    <TableHead className="text-right">AÇÕES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{webhook.url}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {getWebhookTypeLabel(webhook.type)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(webhook.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setWebhookToDelete(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="gap-2 border-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Webhook
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddWebhookModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddWebhook}
      />

      <AlertDialog open={!!webhookToDelete} onOpenChange={(open) => !open && setWebhookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este webhook? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => webhookToDelete && handleDeleteWebhook(webhookToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
