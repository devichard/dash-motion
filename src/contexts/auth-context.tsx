"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "@/lib/cookies";
import { decodeJWT, isTokenExpired } from "@/lib/jwt";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    setUser(null);
    deleteCookie("token");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    const token = getCookie("token");

    if (token) {
      if (isTokenExpired(token)) {
        logout();
        return;
      }

      // Tenta pegar dados do localStorage primeiro (tem approved correto)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          return;
        } catch {
          // Se falhar, continua para decodificar o JWT
        }
      }

      // Fallback: Decodifica o JWT para pegar os dados do usuário
      const userData = decodeJWT(token);
      if (userData) {
        setUser(userData);
      } else {
        logout();
      }
    }
  }, [logout]);

  const handleSetToken = (token: string) => {
    // (7 dias)
    setCookie("token", token, 7);

    const userData = decodeJWT(token);
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const handleSetUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setToken: handleSetToken,
        setUser: handleSetUser,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
