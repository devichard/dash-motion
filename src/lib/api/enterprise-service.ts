import type { DocumentType, Enterprise, NewEnterpriseData } from "@/types/enterprise";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";

export const enterpriseService = {
  async create(data: NewEnterpriseData): Promise<ApiResponse<Enterprise>> {
    const response = await apiClient.post<Enterprise>("/api/v1/enterprises", data);
    if (response.success && response.data?.id) {
      localStorage.setItem("enterpriseId", response.data.id);
    }
    return response;
  },

  async update(_id: string, data: Partial<NewEnterpriseData>): Promise<ApiResponse<Enterprise>> {
    return apiClient.patch<Enterprise>("/api/v1/enterprises", data);
  },

  async uploadDocuments(id: string, files: Partial<Record<DocumentType, File>>): Promise<ApiResponse<void>> {
    const formData = new FormData();

    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    return apiClient.post<void>(`/api/v1/enterprises/${id}/documents`, formData);
  },

  async updateDocument(id: string, type: DocumentType, file: File): Promise<ApiResponse<void>> {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.patch<void>(`/api/v1/enterprises/${id}/documents/${type}`, formData, {});
  },

  async get(id?: string): Promise<ApiResponse<Enterprise | Enterprise[]>> {
    const endpoint = id ? `/api/v1/enterprises/${id}` : "/api/v1/enterprises";
    return apiClient.get<Enterprise | Enterprise[]>(endpoint);
  },

  async remove(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/enterprises/${id}`);
  },
};
