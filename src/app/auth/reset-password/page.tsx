"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const _router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, _setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Token de recuperação não encontrado. Solicite um novo link.");
      toast.error("Token de recuperação não encontrado. Solicite um novo link.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (!token) {
      toast.error("Token inválido. Solicite um novo link de recuperação.");
      return;
    }

    setLoading(true);

    try {
      toast.info("Redefinição de senha ainda não implementada");
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      toast.error("Erro ao redefinir senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex">
        <div className="w-full lg:w-2/5 border-r flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">Senha Redefinida!</h1>
            <p className="text-muted-foreground mb-8">
              Sua senha foi alterada com sucesso.
              <br />
              <br />
              Você será redirecionado para a página de login em alguns segundos...
            </p>

            <Link href="/auth/signin">
              <Button variant="outline" className="w-full h-12">
                Ir para o login
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-3/5 bg-background-alternative items-center justify-center"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen w-full flex">
        <div className="w-full lg:w-2/5 border-r flex flex-col items-center justify-center">
          <div className="max-w-md w-full text-center px-8">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">Link Inválido</h1>
            <p className="text-muted-foreground mb-8">
              O link de recuperação é inválido ou expirou.
              <br />
              <br />
              Solicite um novo link para redefinir sua senha.
            </p>

            <Link href="/auth/forgot-password">
              <Button variant="outline" className="w-full h-12">
                Solicitar novo link
              </Button>
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-3/5 bg-background-alternative items-center justify-center"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex">
      <div className="w-full lg:w-2/5 border-r flex flex-col items-center justify-center">
        <div className="max-w-md w-full px-8">
          <h1 className="text-3xl font-bold">Redefinir Senha</h1>
          <p className="text-muted-foreground mb-8">Digite sua nova senha abaixo.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className=" bg-destructive/5 border border-red-500 text-destructive rounded-lg p-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                Nova Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua nova senha"
                required
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="h-12"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">
                Confirmar Nova Senha
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirme sua nova senha"
                required
                minLength={8}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                className="h-12"
                disabled={loading}
              />
            </div>

            <Button type="submit" variant="primary" className="w-full h-12" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Redefinindo...
                </>
              ) : (
                "Redefinir Senha"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Lembrou sua senha?{" "}
              <Link href="/auth/signin" className="underline text-foreground">
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-3/5 bg-background-alternative items-center justify-center"></div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
