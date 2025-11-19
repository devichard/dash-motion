"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

interface RequireApprovalProps {
  children: React.ReactNode;
}

export function RequireApproval({ children }: RequireApprovalProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aguarda o contexto carregar os dados do usuário
    if (user !== null || !isAuthenticated) {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    // Aguarda o loading terminar antes de fazer redirecionamentos
    if (isLoading) return;

    // Se não está autenticado, redireciona para login
    if (!isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    // Admin sempre tem acesso completo
    if (user?.role === "admin") {
      return;
    }

    // Se é seller não aprovado e não está na página enterprise, redireciona para enterprise
    if (user && user.role === "seller" && !user.approved && pathname !== "/seller/overview") {
      router.push("/onboarding");
      return;
    }
  }, [user, isAuthenticated, router, pathname, isLoading]);

  // Mostra loading enquanto carrega os dados do usuário
  if (isLoading) {
    return null;
  }

  // Se não está autenticado, não renderiza nada
  if (!isAuthenticated) {
    return null;
  }

  // Admin sempre pode ver tudo
  if (user?.role === "admin") {
    return <>{children}</>;
  }

  // Seller aprovado pode ver todas as páginas exceto enterprise
  if (user?.role === "seller" && user.approved) {
    return <>{children}</>;
  }

  // Seller não aprovado só vê a página enterprise
  if (user?.role === "seller" && !user.approved && pathname === "/seller/enterprise") {
    return <>{children}</>;
  }

  // Bloqueia acesso em outros casos
  return null;
}
