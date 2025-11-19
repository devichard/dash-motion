"use client";

import { Crown, Medal } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CompanyRanking {
  id: string;
  name: string;
  volume: number;
  transactions: number;
  growth: number;
  risk: "Baixo" | "Moderado" | "Alto";
  category: string;
  status: "Ativa" | "Inativa";
}

const rankingData: CompanyRanking[] = [
  {
    id: "1",
    name: "LemonHub",
    volume: 345000,
    transactions: 1280,
    growth: 18.4,
    risk: "Baixo",
    category: "Tecnologia",
    status: "Ativa",
  },
  {
    id: "2",
    name: "InfinityPay",
    volume: 287500,
    transactions: 1065,
    growth: 23.7,
    risk: "Moderado",
    category: "Serviços",
    status: "Ativa",
  },
  {
    id: "3",
    name: "TechCorp Brasil",
    volume: 192300,
    transactions: 845,
    growth: 11.9,
    risk: "Baixo",
    category: "Comércio",
    status: "Ativa",
  },
  {
    id: "4",
    name: "NovaPag",
    volume: 154800,
    transactions: 610,
    growth: 35.2,
    risk: "Moderado",
    category: "Marketplace",
    status: "Ativa",
  },
  {
    id: "5",
    name: "QuickLinx",
    volume: 102450,
    transactions: 430,
    growth: -4.1,
    risk: "Alto",
    category: "Varejo",
    status: "Inativa",
  },
];

const sortOptions = [
  { value: "volume", label: "Volume" },
  { value: "transactions", label: "Transações" },
  { value: "growth", label: "Crescimento" },
  { value: "risk", label: "Risco" },
];

const periodOptions = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
];

export default function RankingPage() {
  const [sortBy, setSortBy] = useState<string>(sortOptions[0].value);
  const [period, setPeriod] = useState<string>(periodOptions[0].value);

  const sortedCompanies = useMemo(() => {
    const data = [...rankingData];
    const riskOrder: Record<CompanyRanking["risk"], number> = {
      Baixo: 3,
      Moderado: 2,
      Alto: 1,
    };
    data.sort((a, b) => {
      if (sortBy === "growth") return b.growth - a.growth;
      if (sortBy === "volume") return b.volume - a.volume;
      if (sortBy === "transactions") return b.transactions - a.transactions;
      if (sortBy === "risk") return riskOrder[b.risk] - riskOrder[a.risk];
      return 0;
    });
    return data;
  }, [sortBy]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

  const formatNumber = (value: number) => new Intl.NumberFormat("pt-BR").format(value);

  const topPerformer = sortedCompanies[0];
  const biggestGrowth = [...sortedCompanies].sort((a, b) => b.growth - a.growth)[0];
  const totalVolume = sortedCompanies.reduce((acc, company) => acc + company.volume, 0);
  const totalTransactions = sortedCompanies.reduce((acc, company) => acc + company.transactions, 0);

  const highlightCards = [
    {
      title: "Top Performer",
      value: topPerformer ? topPerformer.name : "Sem dados",
      helper: topPerformer ? formatCurrency(topPerformer.volume) : "Aguardando movimentações",
    },
    {
      title: "Maior Crescimento",
      value: biggestGrowth ? biggestGrowth.name : "Sem dados",
      helper: biggestGrowth ? `${biggestGrowth.growth.toFixed(1)}% no período` : "Aguardando movimentações",
    },
    {
      title: "Volume Total",
      value: formatCurrency(totalVolume),
      helper: `Período selecionado (${periodOptions.find((p) => p.value === period)?.label})`,
    },
    {
      title: "Transações Totais",
      value: formatNumber(totalTransactions),
      helper: `Período selecionado (${periodOptions.find((p) => p.value === period)?.label})`,
    },
  ];

  const getRiskBadgeColor = (risk: CompanyRanking["risk"]) => {
    switch (risk) {
      case "Baixo":
        return "bg-green-500";
      case "Moderado":
        return "bg-yellow-500";
      case "Alto":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadgeColor = (status: CompanyRanking["status"]) => {
    switch (status) {
      case "Ativa":
        return "bg-green-500";
      case "Inativa":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const podiumIcons = [Crown, Medal, Medal];
  const podiumStyles = [
    "border-yellow-400/70 bg-yellow-500/10 text-yellow-200",
    "border-slate-300/70 bg-slate-200/10 text-slate-100",
    "border-amber-700/70 bg-amber-900/20 text-amber-200",
  ];
  const podiumLabel = (index: number) => ["1º lugar", "2º lugar", "3º lugar"][index];

  return (
    <section className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-xl">Ranking de Empresas</h1>
        <p className="text-sm text-muted-foreground">
          Compare a performance das empresas através de métricas de volume, crescimento e risco.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border bg-card/40 p-4">
        <div className="flex min-w-[220px] flex-1 flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ordenar por</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione a métrica" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex min-w-[220px] flex-1 flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Período</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {highlightCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="px-6! py-5!">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold">{card.value}</p>
              <span className="text-sm text-muted-foreground">{card.helper}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader className="bg-popover/30">
            <TableRow>
              <TableHead className="w-24">Posição</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Transações</TableHead>
              <TableHead>Crescimento</TableHead>
              <TableHead>Risco</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCompanies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  Nenhuma empresa classificada para o período selecionado.
                </TableCell>
              </TableRow>
            ) : (
              sortedCompanies.map((company, index) => (
                <TableRow key={company.id}>
                  <TableCell className="font-semibold">
                    <div className="flex items-center gap-3">
                      {index < 3 && (
                        <>
                          <span
                            className={`flex items-center justify-center rounded-full border p-1 ${podiumStyles[index]}`}
                          >
                            {(() => {
                              const Icon = podiumIcons[index];
                              return <Icon className="size-4" />;
                            })()}
                          </span>
                          <span>{podiumLabel(index)}</span>
                        </>
                      )}
                      <span className="text-muted-foreground text-xs">#{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{formatCurrency(company.volume)}</TableCell>
                  <TableCell>{formatNumber(company.transactions)}</TableCell>
                  <TableCell>{company.growth.toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className={`size-1.5 rounded-full ${getRiskBadgeColor(company.risk)}`}
                        aria-hidden="true"
                      ></span>
                      {company.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1.5">
                      <span
                        className={`size-1.5 rounded-full ${getStatusBadgeColor(company.status)}`}
                        aria-hidden="true"
                      ></span>
                      {company.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
