"use client";
import { ChevronLeft, ChevronRight, Lock, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

export default function HeaderDashboard() {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { user } = useAuth();
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState(0);

  const isSeller = user?.role !== "admin";

  const segments = useMemo(() => {
    const parts = pathname.replace(/^\/+|\/+$/g, "").split("/");
    const dashboardIndex = parts.indexOf("dashboard");
    const after = dashboardIndex >= 0 ? parts.slice(dashboardIndex + 1) : parts;
    return after.filter(Boolean).map((seg) => decodeURIComponent(seg));
  }, [pathname]);

  const labelMap: Record<string, string> = {
    // Rotas Breadcrumb - Admins
    admin: "Administrador",
    overview: "Visão Geral",
    kyc: "Solicitações KYC",
    enterprise: "Todas as Empresas",
    transactions: "Todas as Transações",
    withdrawals: "Todos os Saques",
    anticipations: "Todas Antecipações",
    invoicing: "Faturamento por Período",
    "company-invoicing": "Lucro por Empresa",
    acquirer: "Faturamento por Adquirente",
    team: "Equipes",
    ads: "Anúncios",
    ranking: "Ranking",
    affiliates: "Afiliados",

    // Rotas Breadcrumb - Sellers
    seller: "Area do Cliente",
    account: "Minha Conta",
    receipts: "Recebimentos",
    fees: "Taxas",
    customers: "Meus clientes",
    "payment-links": "Links de pagamento",
    integrations: "Integrações",
  };

  const toLabel = (slug: string) => {
    if (/\d/.test(slug) && /[./]/.test(slug)) {
      return slug;
    }
    return labelMap[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  };

  const breadcrumbItems = useMemo(() => {
    const base = "";
    return segments.map((seg, idx) => ({
      seg,
      href: `${base}/${segments
        .slice(0, idx + 1)
        .map((s) => encodeURIComponent(s))
        .join("/")}`,
      isLast: idx === segments.length - 1,
    }));
  }, [segments]);

  const rewards = [
    {
      title: "Pulseira Citrus 10K",
      status: "Bloqueado",
      description:
        "Todo pomar começa com a primeira colheita. Ao alcançar 10 mil pedidos pagos, você não está apenas vendendo; está cultivando a base de um império cítrico. Essa pulseira é o símbolo da semente que germinou, do seu compromisso com a jornada e da primeira safra de resultados. Use-a como quem carrega no pulso a lembrança de que grandes limões começam pequenos.",
      rewards: ["Pulseira exclusiva PagLemon 10K"],
      currentValue: 5000,
      targetValue: 10000,
      badge: "Bloqueado",
    },
    {
      title: "Placa Limão Verde 100K",
      status: "Bloqueado",
      description:
        "O verde vibrante é a cor da promessa. Ao bater 100 mil pedidos pagos, você alcança um estágio em que o fruto já tem forma, força e frescor, pronto para amadurecer ainda mais. Esta placa é o reconhecimento do seu vigor e da energia que move o PagLemon: ousar plantar, cuidar e colher. Um marco que prova que o seu pomar está florescendo.",
      rewards: ["Placa Limão Verde", "Kit PagLemon"],
      currentValue: 0,
      targetValue: 100000,
      badge: "Bloqueado",
    },
  ];

  const currentRewardData = rewards[currentReward];
  const progressPercentage = (currentRewardData.currentValue / currentRewardData.targetValue) * 100;

  return (
    <header className="border-b bg-background px-4 md:px-6 fixed top-0 left-0 right-0 z-30">
      <div className="flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link href="/overview">
            <div className="bg-none flex aspect-square size-8 items-center justify-center rounded-lg">
              <div
                role="img"
                aria-label="Lemon logo"
                className="size-6 bg-foreground mask-[url('/img/logo-green.png')] mask-contain mask-no-repeat mask-center"
              />
            </div>
          </Link>
          <div className="ml-2 text-muted-foreground/60 hidden md:block"> / </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Button
                  variant="ghost"
                  className="focus-visible:bg-accent px-2 font-normal text-muted-foreground hover:text-foreground h-8 focus-visible:ring-0"
                >
                  Lemon
                </Button>
              </BreadcrumbItem>
              {breadcrumbItems.length > 0 && (
                <BreadcrumbSeparator className="hidden md:block text-muted-foreground/60"> / </BreadcrumbSeparator>
              )}
              {breadcrumbItems.map((item) => (
                <Fragment key={item.href}>
                  <BreadcrumbItem className={item.isLast ? "" : "hidden md:block"}>
                    {item.isLast ? (
                      <BreadcrumbPage>{toLabel(item.seg)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>
                          <Button
                            variant="ghost"
                            className="focus-visible:bg-accent px-2 font-normal text-muted-foreground hover:text-foreground h-8 focus-visible:ring-0"
                          >
                            {toLabel(item.seg)}
                          </Button>
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!item.isLast && (
                    <BreadcrumbSeparator className="hidden md:block text-muted-foreground/60 pr-2">
                      {" "}
                      /{" "}
                    </BreadcrumbSeparator>
                  )}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-3">
          {isSeller && (
            <button
              type="button"
              className="hidden md:flex items-center gap-2 cursor-pointer bg-transparent border-0 p-0"
              onClick={() => setIsRewardsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsRewardsOpen(true);
                }
              }}
            >
              <Trophy size={16} className="text-primary" />
              <span className="text-sm font-medium whitespace-nowrap">Lemon Rewards</span>
              <Progress value={50} className="h-2 w-32" />
              <span className="text-sm text-muted-foreground">50%</span>
            </button>
          )}
          <Button className="group size-8 md:hidden" variant="ghost" size="icon" onClick={toggleSidebar}>
            <svg
              className="pointer-events-none"
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Menu"
            >
              <title>Menu</title>
              <path
                d="M4 12L20 12"
                className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]"
              />
              <path
                d="M4 12H20"
                className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]"
              />
              <path
                d="M4 12H20"
                className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]"
              />
            </svg>
          </Button>
        </div>
      </div>

      {isSeller && (
        <Dialog open={isRewardsOpen} onOpenChange={setIsRewardsOpen}>
          <DialogContent className="min-w-4xl p-0">
            <DialogHeader className="p-6 pb-4 text-center">
              <DialogTitle className="text-2xl font-bold">Lemon Rewards - Programa de Benefícios</DialogTitle>
              <DialogDescription>Acompanhe seu progresso e conquiste recompensas exclusivas</DialogDescription>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6 p-6 pt-0">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">{currentRewardData.title}</h3>

                <p className="text-sm text-muted-foreground leading-relaxed">{currentRewardData.description}</p>

                <div className="space-y-2">
                  <p className="font-semibold">Recompensas:</p>
                  <ul className="space-y-1">
                    {currentRewardData.rewards.map((reward) => (
                      <li key={reward} className="flex items-center gap-2 text-sm">
                        <div className="size-1.5 rounded-full bg-primary" />
                        {reward}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary font-semibold">
                      R$ {currentRewardData.currentValue.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-muted-foreground">
                      R$ {currentRewardData.targetValue.toLocaleString("pt-BR")}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <p className="text-center text-sm italic text-muted-foreground">
                  Dê o próximo passo e colha sua placa!
                </p>

                <Button variant="primary" className="w-full" disabled>
                  <Lock className="mr-2 size-4" />
                  Resgatar
                </Button>
              </div>

              <div className="flex items-center justify-center bg-muted/30 rounded-lg p-8">
                <div className="relative">
                  <div className="relative">
                    <Lock className="mx-auto size-16 text-primary" />
                    <div>
                      <p className="font-bold text-center mt-2 text-lg">Bloqueado</p>
                      <p className="text-sm text-muted-foreground">
                        Meta: R$ {currentRewardData.targetValue.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentReward(Math.max(0, currentReward - 1))}
                disabled={currentReward === 0}
              >
                <ChevronLeft className="mr-1 size-4" />
                Recompensa anterior
              </Button>

              <div className="flex gap-1.5">
                {rewards.map((reward, idx) => (
                  <div
                    key={reward.title}
                    className={`size-2 rounded-full transition-colors ${
                      idx === currentReward ? "bg-primary" : "bg-popover"
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentReward(Math.min(rewards.length - 1, currentReward + 1))}
                disabled={currentReward === rewards.length - 1}
              >
                Próxima recompensa
                <ChevronRight className="ml-1 size-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
}
