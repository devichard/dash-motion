import type { CreateWithdrawalData, Withdrawal, WithdrawalRequestResponse } from "@/types/withdrawals";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export const withdrawalsService = {
  async list(page: number = 1, perPage: number = 10): Promise<ApiResponse<WithdrawalRequestResponse>> {
    return apiClient.get<WithdrawalRequestResponse>(`/api/v1/withdrawals?page=${page}&perPage=${perPage}`);
  },

  async getById(id: string): Promise<ApiResponse<Withdrawal>> {
    return apiClient.get<Withdrawal>(`/api/v1/withdrawals/${id}`);
  },

  async create(data: CreateWithdrawalData): Promise<ApiResponse<Withdrawal>> {
    return apiClient.post<Withdrawal>(`/api/v1/withdrawals`, data);
  },
};
