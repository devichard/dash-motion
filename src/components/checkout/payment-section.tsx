"use client";

import { Bitcoin, Check, Copy, CreditCard } from "lucide-react";
import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/payments";

interface PaymentSectionProps {
  showQrCode: boolean;
  pix: string;
}

export default function PaymentSection({ showQrCode, pix }: PaymentSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.pix);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (showQrCode && !qrCodeUrl) {
      QRCode.toDataURL(pix, { width: 280, margin: 2 })
        .then((url) => setQrCodeUrl(url))
        .catch((err) => console.error(err));
    }
  }, [showQrCode, qrCodeUrl, pix]);

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pix);
    setCopied(true);
    toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const paymentMethods = [
    {
      id: "pix" as PaymentMethod,
      name: "Pix",
      icon: <Image width={24} height={24} src="/img/payments/pix.png" alt="pix" />,
      badge: "Instantâneo",
      available: true,
    },
    {
      id: "card" as PaymentMethod,
      name: "Cartão",
      icon: <CreditCard className="size-5" />,
      badge: "Em breve",
      available: false,
    },
    {
      id: "crypto" as PaymentMethod,
      name: "Criptomoeda",
      icon: <Bitcoin className="size-5" />,
      badge: "Em breve",
      available: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => {
              if (!method.available) {
                toast.info(`${method.name} estará disponível em breve!`);
                return;
              }
              setSelectedMethod(method.id);
            }}
            disabled={!method.available}
            className={`w-full p-4 flex items-center justify-between rounded-lg border-2 transition-all ${
              selectedMethod === method.id && method.available
                ? "bg-primary/5 cursor-pointer border-primary"
                : method.available
                  ? "border-border hover:border-border/80 bg-background"
                  : "border-border bg-muted/50 cursor-not-allowed opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`size-6 rounded-full flex items-center justify-center transition-colors ${
                  selectedMethod === method.id && method.available
                    ? "bg-primary text-primary-foreground"
                    : method.available
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {selectedMethod === method.id && method.available ? (
                  <Check className="size-4" />
                ) : (
                  <div className="size-2 rounded-full bg-current" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={
                    selectedMethod === method.id && method.available
                      ? "text-primary"
                      : method.available
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }
                >
                  {method.icon}
                </div>
                <span
                  className={`font-medium ${
                    selectedMethod === method.id && method.available
                      ? "text-foreground"
                      : method.available
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {method.name}
                </span>
              </div>
            </div>
            <Badge
              variant={method.available ? "default" : "secondary"}
              className={`text-xs uppercase tracking-wide ${
                method.available ? "bg-primary/10 hover:bg-primary/10 text-primary border-primary/20" : ""
              }`}
            >
              {method.badge}
            </Badge>
          </button>
        ))}
      </div>

      {showQrCode && (
        <div className="border border-border rounded-lg p-6 bg-card space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-background border-2 border-border rounded-xl">
              {qrCodeUrl ? (
                <Image src={qrCodeUrl} alt="QR Code Pix" width={280} height={280} className="rounded-lg" />
              ) : (
                <div className="w-[280px] h-[280px] bg-muted animate-pulse rounded-lg" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Escaneie o QR Code para pagar</p>
              <p className="text-sm text-muted-foreground">
                Abra o app do seu banco e use a câmera para escanear o código
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">ou</span>
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="pix-code" className="text-sm font-medium text-foreground block">
              Código Pix Copia e Cola
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  id="pix-code"
                  type="text"
                  value={pix}
                  readOnly
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-xs font-mono text-foreground"
                />
              </div>
            </div>
            <Button onClick={handleCopyPixCode} className="w-full" size="lg" variant="default">
              {copied ? (
                <>
                  <Check className="size-4 mr-2" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="size-4 mr-2" />
                  Copiar código Pix
                </>
              )}
            </Button>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>💡 Dica:</strong> Após copiar o código, cole-o no app do seu banco na opção "Pix Copia e Cola"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
