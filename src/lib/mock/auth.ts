import type { LoginRequest, LoginResponse, User } from "@/types/auth";
import { generateMockJWT } from "./jwt";

// Usuários mock para login
const MOCK_USERS = {
  admin: {
    id: "mock-admin-id",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin",
    approved: true,
  },
  seller: {
    id: "mock-seller-id",
    email: "seller@demo.com",
    password: "seller123",
    role: "seller",
    approved: true,
  },
};

export function mockLogin(request: LoginRequest): LoginResponse | null {
  // Verifica se é admin
  if (
    request.email === MOCK_USERS.admin.email &&
    request.password === MOCK_USERS.admin.password
  ) {
    const user: User = {
      id: MOCK_USERS.admin.id,
      email: MOCK_USERS.admin.email,
      role: MOCK_USERS.admin.role,
      approved: MOCK_USERS.admin.approved,
    };

    const token = generateMockJWT(user);

    return {
      user,
      tokens: {
        access: token,
        refresh: "mock-refresh-token",
      },
    };
  }

  // Verifica se é seller
  if (
    request.email === MOCK_USERS.seller.email &&
    request.password === MOCK_USERS.seller.password
  ) {
    const user: User = {
      id: MOCK_USERS.seller.id,
      email: MOCK_USERS.seller.email,
      role: MOCK_USERS.seller.role,
      approved: MOCK_USERS.seller.approved,
    };

    const token = generateMockJWT(user);

    return {
      user,
      tokens: {
        access: token,
        refresh: "mock-refresh-token",
      },
    };
  }

  return null;
}

