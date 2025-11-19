"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin/overview");
      } else {
        router.push("/seller/enterprise");
      }
    } else {
      router.push("/auth/signin");
    }
  }, [user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-muted-foreground">Carregando...</div>
    </div>
  );
}
