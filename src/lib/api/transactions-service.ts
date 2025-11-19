import type { FinancialTransaction, FinancialTransactionsResponse } from "@/types/transactions";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

type AdminFinancialTransactionsResponse = FinancialTransaction[];

export const transactionsService = {
  async list(page: number = 1, perPage: number = 10): Promise<ApiResponse<FinancialTransactionsResponse>> {
    return apiClient.get<FinancialTransactionsResponse>(`/api/v1/transactions?page=${page}&perPage=${perPage}`);
  },

  async getTransactionById(id: string): Promise<ApiResponse<FinancialTransaction>> {
    return apiClient.get<FinancialTransaction>(`/api/v1/transactions/${id}`);
  },

  async listAdminTransactions(params?: {
    page?: number;
    perPage?: number;
    sellerId?: string;
  }): Promise<ApiResponse<AdminFinancialTransactionsResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.perPage) queryParams.append("perPage", params.perPage.toString());
    if (params?.sellerId) queryParams.append("sellerId", params.sellerId);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    return apiClient.get<AdminFinancialTransactionsResponse>(`/api/v1/admin/transactions${queryString}`);
  },
};
