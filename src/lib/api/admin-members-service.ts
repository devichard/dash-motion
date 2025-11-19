import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";
import {
  AdminMember,
  AdminMembersResponse,
  NewAdminMemberData,
  RoleType,
} from "@/types/users";

// Service para a página de equipes
export const AdminMembersService = {
  // Listar membros
  async list(
    page: number = 1,
    perPage: number = 10
  ): Promise<ApiResponse<AdminMembersResponse>> {
    return apiClient.get<AdminMembersResponse>(
      `/api/v1/admin/members?page=${page}&perPage=${perPage}`
    );
  },

  // Atualizar cargo do membro
  async updateRole(
    id: string,
    data: { newRole: RoleType }
  ): Promise<ApiResponse<AdminMember>> {
    return apiClient.patch<AdminMember>(
      `/api/v1/admin/members/update-role/${id}`,
      data
    );
  },

  // Criar novo membro
  async create(data: NewAdminMemberData): Promise<ApiResponse<AdminMember>> {
    return apiClient.post<AdminMember>(`/api/v1/users`, data);
  },

  // Realizar um soft delete do membro
  async softDelete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/v1/admin/users/${id}`);
  },
};
