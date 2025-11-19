import type { NewPaymentData, Payment, PaymentResponse } from "@/types/payments";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export const paymentsService = {
  async create(data: NewPaymentData): Promise<ApiResponse<Payment>> {
    return apiClient.post<Payment>(`/api/v1/payments`, data);
  },

  async list(page: number = 1, perPage: number = 10): Promise<ApiResponse<PaymentResponse>> {
    return apiClient.get<PaymentResponse>(`/api/v1/payments?page=${page}&perPage=${perPage}`);
  },

  async get(id: string): Promise<ApiResponse<Payment>> {
    return apiClient.get<Payment>(`/api/v1/payments/${id}`);
  },
};
