import type { User } from "@/types/auth";

export function decodeJWT(token: string): User | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(decoded);

    return {
      id: data.user?.id || data.id,
      email: data.user?.email || data.email,
      role: data.user?.role || data.role,
      approved: data.user?.approved ?? data.approved ?? false,
    };
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return true;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(decoded);

    if (!data.exp) {
      return false;
    }

    const now = Math.floor(Date.now() / 1000);
    return data.exp < now;
  } catch (_error) {
    return true;
  }
}
