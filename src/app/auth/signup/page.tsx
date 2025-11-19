"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { authService } from "@/lib/api/auth-service";
import { registerSchema } from "@/lib/validations/auth";

export default function SignUp() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { setToken, setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = registerSchema.safeParse({
      companyName,
      email,
      password,
      confirmPassword,
    });

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
      const response = await authService.register({
        email: validation.data.email,
        password: validation.data.password,
        companyName: validation.data.companyName,
      });

      if (response.success) {
        const { user, tokens } = response.data;

        setToken(tokens.access);
        setUser(user);
        // localStorage.setItem("refreshToken", tokens.refresh);

        toast.success("Conta criada com sucesso!");
        router.refresh();
        router.push("/");
      } else {
        toast.error(response.errorMessage || "Erro ao criar conta");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Erro inesperado ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full border-r lg:w-2/5 flex flex-col items-center justify-center">
        <div className="max-w-md w-full px-8">
          <h1 className="text-3xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground mb-8">Digite suas informações para criar uma conta</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="text-sm">
                Nome da Empresa *
              </Label>
              <Input
                id="company-name"
                placeholder="Nome da sua empresa"
                required
                onChange={(e) => setCompanyName(e.target.value)}
                value={companyName}
                className="h-12"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                Email *
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
              <Label htmlFor="password" className="text-sm">
                Senha *
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="h-12"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm">
                Confirmar Senha *
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirme sua senha"
                className="h-12"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full h-12" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Criar conta"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Já tem uma conta?{" "}
            <Link href="/auth/signin" className="underline text-foreground">
              Entre
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-3/5 justify-center items-center bg-background-alternative">
        <Image className="w-auto h-[800px]" src="/img/auth/signup.png" alt="signup" width={1080} height={1080} />
      </div>
    </div>
  );
}
