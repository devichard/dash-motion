"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import Table from "@/components/dashboard/pages/admin/kyc/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function KycPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl">Solicitações KYC</h1>
            <p className="text-muted-foreground text-sm">
              Veja a lista de todas as solicitações pendentes e recusadas para usar a plataforma
            </p>
          </div>
          <div className="flex w-1/2 justify-end items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Aprovado">Aprovado</SelectItem>
                <SelectItem value="Em Análise">Em Análise</SelectItem>
                <SelectItem value="Recusado">Recusado</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1 max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou cnpj"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Table statusFilter={statusFilter} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
}
