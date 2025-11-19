"use client";

import { motion } from "framer-motion";
import { Bitcoin, CreditCard, Landmark, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { systemFeesService } from "@/lib/api/fees-service";
import type { SystemFees } from "@/types/fees";

export default function Fees() {
  const [fees, setFees] = useState<SystemFees[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFees = async () => {
      try {
        const response = await systemFeesService.listSellerFees();

        if (Array.isArray(response)) {
          setFees(response);
        } else if (response.success) {
          setFees(response.data || []);
        } else {
          setFees([]);
        }
      } catch (error) {
        console.error("Erro ao buscar taxas:", error);
        setFees([]);
      } finally {
        setLoading(false);
      }
    };

    loadFees();
  }, []);

  if (loading) {
    return <div className="text-center text-muted-foreground">Carregando taxas...</div>;
  }

  const pixFeePercentage = fees?.find((f) => f.feeType === "PERCENTAGE" && !f.description?.includes("Withdrawal"));
  const pixFeeFixed = fees?.find((f) => f.feeType === "FIXED" && !f.description?.includes("Withdrawal"));

  const cards = [
    {
      icon: Landmark,
      title: "Pix",
      color: "green",
      description: "Receba pagamentos instantâneos via Pix",
      fee: pixFeePercentage && pixFeeFixed ? { pixFeePercentage, pixFeeFixed } : null,
    },
    {
      icon: CreditCard,
      title: "Cartão de Crédito",
      color: "yellow",
      description: "Aceite pagamentos com crédito diretamente na plataforma",
      fee: null,
    },
    {
      icon: Bitcoin,
      title: "Cripto",
      color: "yellow",
      description: "Em breve você poderá receber pagamentos com criptomoedas",
      fee: null,
    },
    {
      icon: Smartphone,
      title: "App Mobile",
      color: "yellow",
      description: "Gerencie seus recebimentos direto do celular",
      fee: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {cards.map((card, i) => {
        const Icon = card.icon;
        const fee = card.fee;

        const status = fee ? "Disponível" : "Em desenvolvimento";
        const statusColor = fee ? "green" : "yellow";

        const details = fee
          ? [
              `${fee.pixFeePercentage.feeValue}% + R$ ${(Number(fee.pixFeeFixed.feeValue)).toFixed(2)} por transação`,
              "Taxa ativa",
            ]
          : [];

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: i * 0.15,
              ease: "easeOut",
            }}
          >
            <Card
              className={`h-full flex flex-col justify-between border-${card.color}-500/30 shadow-md hover:shadow-lg transition-all pt-0`}
            >
              <CardHeader className={`bg-gradient-to-r from-${card.color}-500/10 to-transparent rounded-t-lg p-5`}>
                <CardTitle className="flex justify-between items-center text-2xl font-bold">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-6 w-6 text-${card.color}-600`} />
                    {card.title}
                  </div>
                  <span
                    className={`bg-${statusColor}-500/20 px-3 py-1 text-${statusColor}-600 text-sm border border-${statusColor}-500 rounded-full`}
                  >
                    {status}
                  </span>
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-grow pt-4 space-y-2">
                {details.length > 0 ? (
                  details.map((detail) => (
                    <div
                      key={`${card.title}-${detail}`}
                      className={`text-sm ${detail === details[0] ? "text-xl font-semibold" : "text-muted-foreground"}`}
                    >
                      {detail}
                    </div>
                  ))
                ) : (
                  <div className="opacity-0 p-5 select-none">Placeholder</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
