"use client";

import { Loader, Lock } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import PaymentSection from "@/components/checkout/payment-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentLinksService } from "@/lib/api/payment-links";
import { paymentsService } from "@/lib/api/payments-service";
import type { PaymentLink } from "@/types/payment-links";
import { type Payment, PaymentCurrency, PaymentMethod, PurchaserProvider } from "@/types/payments";

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    document: "",
    phone: "",
  });

  const [paymentLink, setPaymentLink] = useState<PaymentLink>();
  const [paymentCreated, setPaymentCreated] = useState<Payment>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [loadingGateway, setLoadingGateway] = useState(false);

  useEffect(() => {
    // MODO DEMO: Checkout desabilitado - apenas visual
    setError(true);
    setLoading(false);
    setMounted(true);
  }, [slug]);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinalizePurchase = async () => {
    if (!formData.name || !formData.document || !formData.email || !formData.phone) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setLoadingGateway(true);
      const response = await paymentsService.create({
        purchaser: PurchaserProvider.SPLITPAY,
        amount: paymentLink?.amount ?? 0,
        currency: PaymentCurrency.brl,
        customerId: paymentLink?.sellerId ?? "",
        paymentMethod: PaymentMethod.pix,
        paymentLinkId: paymentLink?.id ?? "",
        customer: {
          name: formData.name,
          email: formData.email,
          document: {
            number: formData.document,
            type: formData.document.replace(/[./-]/g, "").length > 11 ? "cnpj" : "cpf",
          },
          phone: formData.phone,
        },
      });

      if (response?.success) setPaymentCreated(response.data);
    } catch (_error) {
      toast.error("Algo de errado aconteceu, tente novamente ou contate o suporte.");
    } finally {
      setLoadingGateway(false);
    }

    setShowQrCode(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-center text-muted-foreground">
        Carregando informações pagamento...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center text-muted-foreground gap-4">
        <span className="text-lg font-semibold">Modo Demo</span>
        <span>Checkout desabilitado nesta versão demo.</span>
        <span>Use apenas o dashboard para visualização.</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
        <div className="px-4 sm:px-6 lg:px-12 py-8">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="mb-8">
              {mounted ? (
                <Image
                  src={currentTheme === "dark" ? "/img/logo-text-white.png" : "/img/logo-text-black.png"}
                  alt="PagLemon"
                  width={130}
                  height={30}
                />
              ) : (
                <div style={{ width: 130, height: 30 }} />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-foreground mb-6">Informações de contato</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="document">CPF/CNPJ</Label>
                    <Input
                      id="document"
                      placeholder="000.000.000-00"
                      value={formData.document}
                      onChange={(e) => handleFieldChange("document", e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div id="payment-section">
              <h2 className="text-xl font-semibold text-foreground mb-6">Pagamento</h2>
              <PaymentSection showQrCode={showQrCode} pix={paymentCreated?.qrCode ?? "QrCode Copia e Cola"} />
            </div>

            {!showQrCode && (
              <Button
                variant="primary"
                onClick={handleFinalizePurchase}
                size="lg"
                disabled={loadingGateway}
                className="w-full bg-primary text-background h-12"
              >
                {loadingGateway && <Loader className="animate-spin" />}
                Pagar {formatCurrency(paymentLink?.amount ?? 0)}
              </Button>
            )}

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="size-4" />
              <span>Pagamento seguro e criptografado</span>
            </div>
          </div>
        </div>

        <div className="lg:h-screen lg:sticky lg:top-0 bg-muted/30 border-l border-border">
          <div className="h-full px-8 py-12 flex flex-col">
            <h2 className="text-2xl font-bold text-foreground mb-8">Resumo do Pedido</h2>

            <div className="flex-1 space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {paymentLink?.description ?? "Descrição do produto"}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">{formatCurrency(paymentLink?.amount ?? 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Desconto</span>
                  <span className="font-medium text-foreground">{formatCurrency(0)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-foreground">{formatCurrency(paymentLink?.amount ?? 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
