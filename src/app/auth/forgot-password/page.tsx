"use client";

import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      toast.info("Recuperação de senha ainda não implementada");
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Erro ao enviar email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen w-full flex">
        <div className="w-full lg:w-2/5 border-r flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">Email Enviado!</h1>
            <p className="text-muted-foreground mb-8">
              Enviamos um link de recuperação para <strong>{email}</strong>.<br />
              <br />
              Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            </p>

            <Link href="/auth/signin">
              <Button variant="outline" className="w-full h-12">
                Voltar para o login
              </Button>
            </Link>

            <p className="mt-4 text-sm text-muted-foreground">
              Não recebeu o email?{" "}
              <button
                type="button"
                onClick={() => setEmailSent(false)}
                className="text-foreground underline hover:no-underline"
              >
                Tentar novamente
              </button>
            </p>
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
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o login
          </Link>

          <h1 className="text-3xl font-bold">Esqueceu sua senha?</h1>
          <p className="text-muted-foreground mb-8">
            Sem problemas! Digite seu email e enviaremos um link para redefinir sua senha.
          </p>

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

            <Button type="submit" variant="primary" className="w-full h-12" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                "Enviar link de recuperação"
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-3/5 justify-center items-center bg-background-alternative">
        <Image
          className="w-auto h-[800px]"
          src="/img/auth/forgot-password.png"
          alt="forgot-password"
          width={1080}
          height={1080}
        />
      </div>
    </div>
  );
}
