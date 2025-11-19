import type { ApiResponse, CacheOptions, RequestOptions } from "../../types/request-types";
import { getCookie } from "../cookies";
import type { ApiClientService } from "./service";

export class ApiClient implements ApiClientService {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor() {
    // MODO DEMO: Não usa backend URL - apenas mocks
    this.baseUrl = "";
    this.defaultTimeout = 10000;
  }

  private getAuthHeader(): Record<string, string> {
    if (typeof document === "undefined") return {};
    const token = getCookie("token");

    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & {
      cacheOptions?: CacheOptions;
      timeout?: number;
    } = {},
  ): Promise<ApiResponse<T>> {
    // MODO DEMO: Sempre retorna erro - não faz requisições HTTP reais
    // Todos os dados devem vir de mocks
    return {
      status: 503,
      errorMessage: "Demo mode: Backend requests are disabled. Use mock data instead.",
      success: false,
    };
  }

  public get<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers: {
        ...options.headers,
      },
      cacheOptions: options.cache,
      timeout: options.timeout,
    });
  }

  public post<T>(endpoint: string, body: unknown, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    let headers = options.headers || {};
    let requestBody: string | FormData | undefined;

    if (body instanceof FormData) {
      requestBody = body;
    } else {
      headers = {
        "Content-Type": "application/json",
        ...headers,
      };
      requestBody = JSON.stringify(body);
    }

    return this.request<T>(endpoint, {
      method: "POST",
      headers: headers,
      body: requestBody,
      cacheOptions: options.cache,
      timeout: options.timeout,
    });
  }

  public patch<T>(endpoint: string, body: unknown, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    let headers = options.headers || {};
    let requestBody: string | FormData | undefined;

    if (body instanceof FormData) {
      requestBody = body;
    } else {
      headers = {
        "Content-Type": "application/json",
        ...headers,
      };
      requestBody = JSON.stringify(body);
    }

    return this.request<T>(endpoint, {
      method: "PATCH",
      headers: headers,
      body: requestBody,
      cacheOptions: options.cache,
      timeout: options.timeout,
    });
  }

  public put<T>(endpoint: string, body: unknown, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
      cacheOptions: options.cache,
      timeout: options.timeout,
    });
  }

  public delete<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers: {
        ...options.headers,
      },
      cacheOptions: options.cache,
      timeout: options.timeout,
    });
  }

  public getCached<T>(
    endpoint: string,
    revalidateInSeconds: number = 120,
    tags?: string[],
    options: Omit<RequestOptions, "cache"> = {},
  ): Promise<ApiResponse<T>> {
    return this.get<T>(endpoint, {
      ...options,
      cache: {
        cache: "force-cache",
        revalidate: revalidateInSeconds,
        tags,
      },
    });
  }
}

export const apiClient = new ApiClient();
