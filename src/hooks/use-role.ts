import { useAuth } from "@/contexts/auth-context";

export function useRole() {
  const { user } = useAuth();

  return {
    role: user?.role,
    isAdmin: user?.role === "admin",
    isSeller: user?.role === "seller",
    isAuthenticated: !!user,
  };
}
