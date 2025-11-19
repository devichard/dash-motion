export type RequestSuccess<T> = {
  status: number;
  data: T;
  message: string | undefined;
  success: true;
};

export type RequestFailure = {
  status: number;
  errorMessage: string;
  success: false;
};

export type ApiResponse<T> = RequestSuccess<T> | RequestFailure;

export type CacheOptions = {
  cache?: RequestCache; // 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached'
  revalidate?: number;
  tags?: string[];
};

export type RequestOptions = {
  headers?: HeadersInit;
  cache?: CacheOptions;
  timeout?: number;
};
