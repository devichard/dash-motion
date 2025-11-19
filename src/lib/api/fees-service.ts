import type { NewFee, SystemFees } from "@/types/fees";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export const systemFeesService = {
  // Criar nova taxa (rota admin)
  async create(data: NewFee): Promise<ApiResponse<SystemFees>> {
    return apiClient.post<SystemFees>("/api/v1/admin/fees", data);
  },

  // Lista todas as taxas (rota admin)
  async list(): Promise<ApiResponse<SystemFees[]>> {
    return apiClient.get<SystemFees[]>("/api/v1/admin/fees");
  },

  // Lista as taxas do vendedor logado
  async listSellerFees(): Promise<ApiResponse<SystemFees[]>> {
    return apiClient.get<SystemFees[]>("/api/v1/fees/me");
  },

  async findBySellerId(id: string): Promise<ApiResponse<SystemFees[]>> {
    try {
      const response = await apiClient.get<SystemFees[]>(`/api/v1/admin/fees/${id}`);

      if (response.success) {
        return response;
      }

      if (response.status === 404) {
        return {
          success: true,
          status: 200,
          data: [],
          message: "No fees found for this seller",
        };
      }

      return response;
    } catch (error) {
      console.warn("Error fetching seller fees, assuming no fees exist yet:", error);
      return {
        success: true,
        status: 200,
        data: [],
        message: "No fees found for this seller",
      };
    }
  },

  async update(id: string, data: Partial<SystemFees>): Promise<ApiResponse<SystemFees>> {
    return apiClient.put<SystemFees>(`/api/v1/admin/fees/${id}`, data);
  },

  async setSellerFees(sellerId: string, fees: NewFee[]): Promise<ApiResponse<SystemFees[]>> {
    try {
      const existingFeesResponse = await this.findBySellerId(sellerId);

      if (!existingFeesResponse.success) {
        return {
          success: false,
          status: existingFeesResponse.status || 500,
          errorMessage: existingFeesResponse.errorMessage || "Failed to fetch existing fees",
        };
      }

      const existingFees = existingFeesResponse.data || [];

      const existingFeesMap = new Map<string, SystemFees>();
      existingFees.forEach((fee) => {
        const key = `${fee.description || ""}-${fee.feeType}`;
        existingFeesMap.set(key, fee);
      });

      const results: SystemFees[] = [];
      const errors: string[] = [];

      for (const fee of fees) {
        const key = `${fee.description || ""}-${fee.feeType}`;
        const existingFee = existingFeesMap.get(key);

        try {
          if (existingFee) {
            const updateResponse = await this.update(existingFee.id, {
              feeValue: fee.feeValue,
            });

            if (updateResponse.success && updateResponse.data) {
              results.push(updateResponse.data);
            } else if (!updateResponse.success) {
              errors.push(`Failed to update fee ${fee.description}: ${updateResponse.errorMessage || "Unknown error"}`);
            }
          } else {
            // Create new fee
            // Make sure the sellerId is set on the fee
            const feeWithSellerId = {
              ...fee,
              sellerId: fee.sellerId || sellerId,
            };

            const createResponse = await this.create(feeWithSellerId);

            if (createResponse.success && createResponse.data) {
              results.push(createResponse.data);
            } else if (!createResponse.success) {
              errors.push(`Failed to create fee ${fee.description}: ${createResponse.errorMessage || "Unknown error"}`);
            }
          }
        } catch (error) {
          errors.push(
            `Error processing fee ${fee.description}: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
        }
      }

      if (errors.length > 0) {
        return {
          success: false,
          status: 500,
          errorMessage: errors.join("; "),
        };
      }

      return {
        success: true,
        status: 200,
        data: results,
        message: "Fees updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        status: 500,
        errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
};
