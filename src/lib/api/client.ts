import type { ApiResponse, CacheOptions, RequestOptions } from "../../types/request-types";
import { getCookie } from "../cookies";
import type { ApiClientService } from "./service";

export class ApiClient implements ApiClientService {
  private readonly baseUrl: string;
  private readonly defaultTimeout: number;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";
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
    const { cacheOptions = {}, timeout = this.defaultTimeout, ...fetchOptions } = options;

    const nextConfig: { revalidate?: number; tags?: string[] } = {};
    if (cacheOptions.revalidate !== undefined) {
      nextConfig.revalidate = cacheOptions.revalidate;
    }
    if (cacheOptions.tags && cacheOptions.tags.length > 0) {
      nextConfig.tags = cacheOptions.tags;
    }

    const mergedHeaders = {
      ...fetchOptions.headers,
      ...this.getAuthHeader(),
    };

    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers: mergedHeaders,
      cache: cacheOptions.cache || "no-cache",
      // credentials: "include", -- (por enquanto nao utilizar)
      ...nextConfig,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = response.statusText;
        try {
          const errorData = await response.json();
          errorMessage = errorData?.errorMessage || errorData?.error || errorData?.message || errorMessage;
        } catch (parseError) {
          // Manter errorMessage original se JSON parsing falhar
          console.warn("Failed to parse error response:", parseError);
        }

        return {
          status: response.status,
          errorMessage,
          success: false,
        };
      }

      const contentType = response.headers.get("content-type");
      let data: T;

      if (contentType?.includes("application/json")) {
        const jsonData = await response.json();
        // Se jsonData é null, retornar null diretamente
        if (jsonData === null) {
          data = null as T;
        }
        // Se a resposta tem propriedades de paginação, preservar o objeto completo
        else if (
          jsonData &&
          typeof jsonData === "object" &&
          "totalPages" in jsonData &&
          "totalRecords" in jsonData &&
          Array.isArray(jsonData.data)
        ) {
          data = jsonData as T;
        } else {
          // Verificar se jsonData tem propriedade data E não é um objeto SellerBalances ou similar
          // Objetos como SellerBalances não devem ter data extraído
          if (jsonData && typeof jsonData === "object" && "data" in jsonData) {
            // Só extrair data se não for um objeto que já tem as propriedades esperadas diretamente
            // (como SellerBalances que tem sellerId, availableBalance, etc)
            const hasBalanceProperties =
              "sellerId" in jsonData || "availableBalance" in jsonData || "pendingBalance" in jsonData;
            if (!hasBalanceProperties) {
              data = jsonData.data;
            } else {
              data = jsonData as T;
            }
          } else {
            data = jsonData;
          }
        }
      } else {
        data = {} as T;
      }

      return {
        status: response.status,
        data,
        message: undefined,
        success: true,
      };
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      const errorMessage =
        err?.name === "AbortError"
          ? "Timeout: A requisição demorou muito para responder"
          : err?.message || "Erro desconhecido";

      return {
        status: 0,
        errorMessage,
        success: false,
      };
    }
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
