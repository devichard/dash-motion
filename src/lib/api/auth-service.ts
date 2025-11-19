import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponseWithToken } from "@/types/auth";
import type { ApiResponse } from "../../types/request-types";
import { apiClient } from "./client";
import { mockLogin } from "../mock/auth";

const isMockMode = () => {
  return !process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL === "";
};

export const authService = {
  async register(data: RegisterRequest): Promise<ApiResponse<RegisterResponseWithToken>> {
    if (isMockMode()) {
      // No modo mock, retorna erro pois não implementamos registro mock
      return {
        success: false,
        status: 400,
        errorMessage: "Modo mock: Use os logins pré-configurados. Admin: admin@demo.com / Seller: seller@demo.com",
      };
    }
    return apiClient.post<RegisterResponseWithToken>("/api/v1/auth/register", data);
  },

  async login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    if (isMockMode()) {
      // Simula delay de rede
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockResponse = mockLogin(data);

      if (mockResponse) {
        return {
          success: true,
          status: 200,
          data: mockResponse,
        };
      }

      return {
        success: false,
        status: 401,
        errorMessage: "Email ou senha incorretos. Use admin@demo.com / admin123 ou seller@demo.com / seller123",
      };
    }

    return apiClient.post<LoginResponse>("/api/v1/auth/login", data);
  },
};
