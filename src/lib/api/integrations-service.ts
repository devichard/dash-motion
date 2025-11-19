import type { IntegrationKeys } from "@/types/integrations";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export const integrationsService = {
  async getKeys(): Promise<ApiResponse<IntegrationKeys>> {
    return apiClient.get<IntegrationKeys>(`/api/v1/integrations/credentials`);
  },

  async updateKeys(): Promise<ApiResponse<IntegrationKeys>> {
    return apiClient.put<IntegrationKeys>(`/api/v1/integrations/credentials/regenerate`, {});
  },

};
