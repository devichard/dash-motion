import type { AdminDashboardDataResponse, SellerDashboardDataResponse } from "@/types/dashboard";
import type { DailySalesCount, DailySalesValues } from "@/types/payments";

// Gera um valor aleatório realista entre min e max
function randomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Gera valores com variação suave para parecer mais real
function generateSmoothValue(base: number, variation: number = 0.15): number {
  const change = (Math.random() - 0.5) * variation * base;
  return Math.max(0, base + change);
}

// Dados mock realistas para o dashboard do seller
export function getMockSellerDashboardData(): SellerDashboardDataResponse {
  // Faturamento total: entre 450k e 840k (variando para parecer realista)
  const baseRevenue = 650000; // Base de ~650k
  const totalRevenue = generateSmoothValue(baseRevenue, 0.25);

  // Ticket médio: entre 120 e 450 reais
  const averageTicket = randomValue(120, 450);

  // Quantidade de pedidos baseada no ticket médio
  const qtdPaidOrders = Math.floor(totalRevenue / averageTicket);

  // Reembolsos: entre 2% e 8% dos pedidos
  const refundRate = randomValue(2, 8) / 100;
  const qtdRefunds = Math.floor(qtdPaidOrders * refundRate);

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageTicket: Math.round(averageTicket * 100) / 100,
    qtdPaidOrders,
    qtdRefunds,
  };
}

// Dados mock realistas para o dashboard do admin (valores mais altos)
export function getMockAdminDashboardData(): AdminDashboardDataResponse {
  // Faturamento total: entre 680k e 840k (mais alto que seller individual)
  const baseRevenue = 750000; // Base de ~750k
  const totalRevenue = generateSmoothValue(baseRevenue, 0.15);

  // Ticket médio: entre 180 e 520 reais
  const averageTicket = randomValue(180, 520);

  // Quantidade de pedidos
  const qtdPaidOrders = Math.floor(totalRevenue / averageTicket);

  // Reembolsos: entre 1.5% e 6% dos pedidos
  const refundRate = randomValue(15, 60) / 1000;
  const qtdRefunds = Math.floor(qtdPaidOrders * refundRate);

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageTicket: Math.round(averageTicket * 100) / 100,
    qtdPaidOrders,
    qtdRefunds,
  };
}

// Gera dados diários de vendas para gráficos
export function getMockDailySalesValues(period: "week" | "month" = "month"): DailySalesValues[] {
  const days = period === "week" ? 7 : 30;
  const data: DailySalesValues[] = [];
  const now = new Date();

  // Base de valores diários
  const baseFinished = randomValue(45000, 95000);
  const basePending = randomValue(5000, 15000);
  const baseCancelled = randomValue(2000, 8000);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Adiciona variação suave nos valores para parecer mais realista
    const finished = Math.floor(generateSmoothValue(baseFinished, 0.25));
    const pending = Math.floor(generateSmoothValue(basePending, 0.3));
    const cancelled = Math.floor(generateSmoothValue(baseCancelled, 0.35));

    data.push({
      date: date.toISOString().split("T")[0],
      finished: Math.max(0, finished),
      pending: Math.max(0, pending),
      cancelled: Math.max(0, cancelled),
    });
  }

  return data;
}

// Gera dados diários de quantidade de vendas para gráficos de barras
export function getMockDailySalesCount(period: "week" | "month" = "month"): DailySalesCount[] {
  const days = period === "week" ? 7 : 30;
  const data: DailySalesCount[] = [];
  const now = new Date();

  // Base de contagem diária: entre 120 e 380 vendas por dia
  const baseCount = randomValue(120, 380);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Adiciona variação suave nos valores
    const count = Math.floor(generateSmoothValue(baseCount, 0.25));

    data.push({
      date: date.toISOString().split("T")[0],
      count: Math.max(0, count),
    });
  }

  return data;
}

