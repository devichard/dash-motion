export interface RegisterRequest {
  email: string;
  password: string;
  companyName: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  role: string;
  companyName: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    approved: boolean;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface RegisterResponseWithToken {
  user: {
    id: string;
    email: string;
    role: string;
    approved: boolean;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
  approved: boolean;
}
