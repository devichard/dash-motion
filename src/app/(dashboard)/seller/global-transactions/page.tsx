"use client";

import { BadgeDollarSign, ShoppingCart } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberTicker } from "@/components/ui/number-ticker";

export default function GlobalTransactionsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl">Transações Globais</h1>
        <p className="text-muted-foreground text-sm">Acompanhe em tempo real suas vendas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
              <BadgeDollarSign className="size-4" />
              Total de Vendas
            </CardDescription>
            <CardTitle className="text-3xl font-medium">
              <NumberTicker value={12230} variant="currency" decimalPlaces={2} />
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="text-xs text-muted-foreground flex items-center gap-2">
              <ShoppingCart className="size-4" />
              Pedidos
            </CardDescription>
            <CardTitle className="text-3xl font-medium">
              <NumberTicker value={589} />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="w-full h-[600px]">
        {/* Espaço reservado para o globo/mapa */}
      </div>
    </div>
  );
}

