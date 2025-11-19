import type { NewPaymentLinkData, PaymentLink } from "@/types/payment-links";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export const paymentLinksService = {
  async create(data: NewPaymentLinkData): Promise<ApiResponse<PaymentLink>> {
    return apiClient.post<PaymentLink>(`/api/v1/payment-links`, data);
  },

  async list(): Promise<ApiResponse<PaymentLink[]>> {
    return apiClient.get<PaymentLink[]>(`/api/v1/payment-links`);
  },

  async getByHash(hash: string): Promise<ApiResponse<PaymentLink>> {
    return apiClient.get<PaymentLink>(`/api/v1/payment-links/${hash}`);
  },

  async deleteById(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/payment-links/${id}`);
  },
};
