import type { ApiResponse, RequestOptions } from "../../types/request-types";

export interface ApiClientService {
  get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
  getCached<T>(
    endpoint: string,
    revalidateInSeconds?: number,
    tags?: string[],
    options?: Omit<RequestOptions, "cache">,
  ): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>>;
}
