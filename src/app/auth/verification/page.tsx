"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-opt";
import { cn } from "@/lib/utils";

function VerificationContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const _router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Por favor, digite o código completo de 6 dígitos");
      return;
    }

    setLoading(true);

    try {
      toast.info("Verificação de email ainda não implementada");
    } catch {
      toast.error("Erro ao verificar código. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email não encontrado");
      return;
    }

    setResending(true);

    try {
      toast.info("Reenvio de código ainda não implementado");
    } catch {
      toast.error("Erro ao reenviar código. Tente novamente.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <form onSubmit={handleVerify}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Digite o código de verificação</h1>
                <FieldDescription className="text-muted-foreground">
                  Enviamos um código de 6 dígitos para <strong>{email}</strong>
                </FieldDescription>
              </div>
              <Field>
                <FieldLabel htmlFor="otp" className="sr-only">
                  Código de verificação
                </FieldLabel>
                <InputOTP
                  maxLength={6}
                  id="otp"
                  required
                  value={otp}
                  onChange={setOtp}
                  containerClassName="gap-4 justify-center"
                >
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-muted-foreground/40">-</InputOTPSeparator>
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center text-muted-foreground mt-4">
                  Não recebeu o código?{" "}
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-foreground underline hover:no-underline disabled:opacity-50"
                  >
                    {resending ? "Reenviando..." : "Reenviar"}
                  </button>
                </FieldDescription>
              </Field>
              <Field>
                <Button variant="primary" type="submit" className="w-full h-12" disabled={loading || otp.length !== 6}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verificar"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <FieldDescription className="px-6 text-center text-muted-foreground text-sm">
            O código expira em 5 minutos
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
