import type { SellerCustomerResponse } from "@/types/seller-customer";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export const sellerCustomerService = {
  async list(page: number = 1, perPage: number = 10): Promise<ApiResponse<SellerCustomerResponse>> {
    return apiClient.get<SellerCustomerResponse>(`/api/v1/customers?page=${page}&perPage=${perPage}`);
  },
};
