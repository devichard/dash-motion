import type { AdminDashboardDataResponse } from "@/types/dashboard";
import type { Enterprise, EnterpriseRevenueResponse } from "@/types/enterprise";
import type {
  AdminPaymentResponse,
  BillingData,
  DailySalesCount,
  DailySalesValues,
  TotalTransactionsData,
} from "@/types/payments";
import type {
  ApplyVisibilityResponse,
  NewVisibilityToSellerData,
  RobinHoodResponse,
  VisibilityLogsResponse,
} from "@/types/robin-hood";
import type { FinancialTransactionsResponse } from "@/types/transactions";
import type { Withdrawal, WithdrawalDashboardData, WithdrawalRequestResponse } from "@/types/withdrawals";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export interface EnterpriseWithUser extends Enterprise {
  user?: {
    id: string;
    email: string;
    approved: boolean;
    role: string;
  };
}

export interface EnterprisesRequestResponse {
  data: EnterpriseWithUser[];
  totalPages: number;
  totalRecords: number;
  currentPage: number;
  perPage: number;
}

export const adminService = {
  //Transações
  async getPayments(page: number = 1, perPage: number = 10): Promise<ApiResponse<AdminPaymentResponse>> {
    return apiClient.get<AdminPaymentResponse>(`/api/v1/admin/payments?page=${page}&perPage=${perPage}`);
  },

  async getTotalTransactionsData(): Promise<ApiResponse<TotalTransactionsData>> {
    return apiClient.get<TotalTransactionsData>(`/api/v1/admin/payments/total-transactions`);
  },
  //Cards do Faturamento
  async getBillingData(): Promise<ApiResponse<BillingData>> {
    return apiClient.get<BillingData>(`/api/v1/admin/payments/billing`);
  },
  //Overview
  async getDashboardOverviewData(
    period?: "week" | "month",
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<AdminDashboardDataResponse>> {
    const isMockMode = !process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL === "";

    if (isMockMode) {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { getMockAdminDashboardData } = await import("../mock/dashboard");
      return {
        success: true,
        status: 200,
        data: getMockAdminDashboardData(),
      };
    }

    return apiClient.get<AdminDashboardDataResponse>(
      `/api/v1/admin/dashboard/overview?period=${period}&startDate=${startDate}&endDate=${endDate}`,
    );
  },

  //Overview: Retorna a quantidade de vendas finalizadas por dia
  async getDashboardDailySalesCountData(
    period?: "week" | "month",
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<DailySalesCount[]>> {
    const isMockMode = !process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL === "";

    if (isMockMode) {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { getMockDailySalesCount } = await import("../mock/dashboard");
      return {
        success: true,
        status: 200,
        data: getMockDailySalesCount(period || "month"),
      };
    }

    return apiClient.get<DailySalesCount[]>(
      `/api/v1/admin/dashboard/daily-sales-count?period=${period}&startDate=${startDate}&endDate=${endDate}`,
    );
  },

  //Overview: Retorna os valores de vendas por dia, separados por status
  async getDashboardDailySalesValuesData(
    period?: "week" | "month",
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<DailySalesValues[]>> {
    const isMockMode = !process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL === "";

    if (isMockMode) {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 300));
      const { getMockDailySalesValues } = await import("../mock/dashboard");
      return {
        success: true,
        status: 200,
        data: getMockDailySalesValues(period || "month"),
      };
    }

    return apiClient.get<DailySalesValues[]>(
      `/api/v1/admin/dashboard/daily-sales-values?period=${period}&startDate=${startDate}&endDate=${endDate}`,
    );
  },

  //Faturamento
  async getEnterpriseRevenue(page: number = 1, perPage: number = 10): Promise<ApiResponse<EnterpriseRevenueResponse>> {
    return apiClient.get<EnterpriseRevenueResponse>(
      `/api/v1/admin/enterprises-revenue?page=${page}&perPage=${perPage}`,
    );
  },

  async getFinancialTransactions(
    page: number = 1,
    perPage: number = 10,
  ): Promise<ApiResponse<FinancialTransactionsResponse>> {
    return apiClient.get<FinancialTransactionsResponse>(`/api/v1/admin/transactions?page=${page}&perPage=${perPage}`);
  },

  async getWithdrawalsDashboardData(): Promise<ApiResponse<WithdrawalDashboardData>> {
    return apiClient.get<WithdrawalDashboardData>(`/api/v1/admin/withdrawals/dashboard`);
  },

  async getWithdrawalsRequest(page: number = 1, perPage: number = 10): Promise<ApiResponse<WithdrawalRequestResponse>> {
    return apiClient.get<WithdrawalRequestResponse>(
      `/api/v1/admin/withdrawals/request?page=${page}&perPage=${perPage}`,
    );
  },

  async approveWithdrawal(withdrawalId: string): Promise<ApiResponse<Withdrawal>> {
    return apiClient.post<Withdrawal>(`/api/v1/admin/withdrawals/${withdrawalId}/approve`, {});
  },

  async rejectWithdrawal(withdrawalId: string): Promise<ApiResponse<Withdrawal>> {
    return apiClient.post<Withdrawal>(`/api/v1/admin/withdrawals/${withdrawalId}/reject`, {});
  },

  async getEnterprisesRequest(
    page: number = 1,
    perPage: number = 10,
  ): Promise<ApiResponse<EnterprisesRequestResponse>> {
    return apiClient.get<EnterprisesRequestResponse>(
      `/api/v1/admin/enterprises/request?page=${page}&perPage=${perPage}`,
    );
  },

  async getEnterprisesAll(page: number = 1, perPage: number = 10): Promise<ApiResponse<EnterprisesRequestResponse>> {
    return apiClient.get<EnterprisesRequestResponse>(`/api/v1/admin/enterprises?page=${page}&perPage=${perPage}`);
  },

  async getEnterpriseById(enterpriseId: string): Promise<ApiResponse<EnterpriseWithUser>> {
    const response = await this.getEnterprisesRequest(1, 50);

    if (!response.success || !response.data) {
      return response as ApiResponse<EnterpriseWithUser>;
    }

    let enterprises: EnterpriseWithUser[] = [];

    if (Array.isArray(response.data)) {
      enterprises = response.data;
    } else if (response.data.data && Array.isArray(response.data.data)) {
      enterprises = response.data.data;
    }

    const enterprise = enterprises.find((e) => e.id === enterpriseId);

    if (!enterprise) {
      return {
        success: false,
        status: 404,
        errorMessage: "Empresa não encontrada",
      };
    }

    return {
      success: true,
      status: 200,
      data: enterprise,
      message: "Empresa encontrada com sucesso",
    };
  },

  async approveEnterprise(enterpriseId: string): Promise<ApiResponse<{ company: Enterprise }>> {
    return apiClient.post<{ company: Enterprise }>(`/api/v1/admin/enterprises/${enterpriseId}/approve`, {});
  },

  async getRanking(start_date: string, end_date: string): Promise<ApiResponse<RobinHoodResponse>> {
    return apiClient.get<RobinHoodResponse>(`/api/v1/admin/robin-hood?start_date=${start_date}&end_date=${end_date}`);
  },

  async getRankingVisibilityLogs(
    page: number = 1,
    perPage: number = 10,
    seller_id?: string,
  ): Promise<ApiResponse<VisibilityLogsResponse>> {
    return apiClient.get<VisibilityLogsResponse>(
      `/api/v1/admin/robin-hood/logs?page=${page}&perPage=${perPage}&seller_id=${seller_id}`,
    );
  },

  async applyVisibilityToSeller(data: NewVisibilityToSellerData): Promise<ApiResponse<ApplyVisibilityResponse>> {
    return apiClient.post<ApplyVisibilityResponse>(`/api/v1/admin/robin-hood/visibility`, data);
  },
};
