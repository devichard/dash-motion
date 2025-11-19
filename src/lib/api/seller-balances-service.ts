import type { SellerBalances } from "@/types/seller-balances";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export const sellerBalancesService = {
  async get(): Promise<ApiResponse<SellerBalances | null>> {
    return apiClient.get<SellerBalances | null>(`/api/v1/seller-balances/me`);
  },
};
