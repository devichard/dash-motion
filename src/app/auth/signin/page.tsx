"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/lib/api/auth-service";
import { loginSchema } from "@/lib/validations/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setToken, setUser } = useAuth();
  const searchParams = useSearchParams();
  const isExpired = searchParams.get("expired") === "true";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        email: validation.data.email,
        password: validation.data.password,
      });

      if (response.success) {
        const { user, tokens } = response.data;

        setToken(tokens.access);
        setUser(user);
        // localStorage.setItem("refreshToken", tokens.refresh);

        toast.success("Login realizado com sucesso!");

        router.refresh();
        router.push("/");
      } else {
        toast.error(response.errorMessage || "Erro ao realizar login");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro inesperado ao realizar login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isExpired) {
      localStorage.clear();

      toast.warning("Sua sessão expirou. Faça login novamente.");
    }
  }, [isExpired]);

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full lg:w-2/5 border-r flex flex-col items-center justify-center">
        <div className="max-w-md w-full px-8">
          <h1 className="text-3xl font-bold">Entre na sua conta</h1>
          <p className="mb-8 text-muted-foreground">Digite seu email abaixo para entrar na sua conta</p>

          {!process.env.NEXT_PUBLIC_BACKEND_URL && (
            <div className="mb-6 p-4 bg-muted rounded-lg border">
              <p className="text-sm font-semibold mb-2">Modo Demo - Acesso Rápido:</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><strong>Admin:</strong> admin@demo.com / admin123</p>
                <p><strong>Seller:</strong> seller@demo.com / seller123</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="h-12"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Link className="flex items-center justify-between" href="/auth/forgot-password">
                <Label htmlFor="password" className="text-sm">
                  Senha
                </Label>
                <span className="text-sm text-muted-foreground">Esqueceu sua senha?</span>
              </Link>
              <Input
                id="password"
                type="password"
                placeholder="senha"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
                disabled={loading}
              />
            </div>

            <Button variant="primary" type="submit" className="w-full h-12" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Entrar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/auth/signup" className="underline text-foreground">
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-3/5 justify-center items-center bg-background-alternative">
        <Image className="w-auto h-[800px]" src="/img/auth/signin.png" alt="signin" width={1080} height={1080} />
      </div>
    </div>
  );
}
