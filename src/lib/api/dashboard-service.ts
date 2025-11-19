import type { SellerDashboardDataResponse } from "@/types/dashboard";
import type { DailySalesValues } from "@/types/payments";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";
import { getMockSellerDashboardData, getMockDailySalesValues } from "../mock/dashboard";

// MODO DEMO: Sempre usa mocks - não faz requisições reais
const isMockMode = () => true;

export const dashboardService = {
  //Overview: cards da página de visão geral
  async getDashboardOverviewData(
    period?: "week" | "month",
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<SellerDashboardDataResponse>> {
    if (isMockMode()) {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        status: 200,
        data: getMockSellerDashboardData(),
        message: undefined,
      };
    }

    return apiClient.get<SellerDashboardDataResponse>(
      `/api/v1/dashboard/overview?period=${period}&startDate=${startDate}&endDate=${endDate}`,
    );
  },

  //Overview: Retorna os valores de vendas por dia, separados por status filtrando pelo vendedor logado
  async getDashboardDailySalesValuesData(
    period?: "week" | "month",
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<DailySalesValues[]>> {
    if (isMockMode()) {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        status: 200,
        data: getMockDailySalesValues(period || "month"),
        message: undefined,
      };
    }

    return apiClient.get<DailySalesValues[]>(
      `/api/v1/dashboard/daily-sales-values?period=${period}&startDate=${startDate}&endDate=${endDate}`,
    );
  },
};
