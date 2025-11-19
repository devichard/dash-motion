"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center bg-background text-foreground">
      <div aria-hidden className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        <span className="font-black text-[34vw] leading-none text-foreground/5 tracking-tight">404</span>
      </div>

      <section className="relative backdrop-blur-sm z-10 mx-auto min-h-screen flex flex-col min-w-screen items-center justify-center px-6 text-center">
        <h1 className="mb-3 inline-flex items-center justify-center gap-2 text-balance text-2xl font-semibold sm:text-3xl">
          Página não encontrada?
        </h1>
        <p className="mb-6 text-pretty text-sm text-muted-foreground sm:text-base">
          Não conseguimos encontrar a página que você está procurando.
        </p>

        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border-button-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </section>
    </main>
  );
}
