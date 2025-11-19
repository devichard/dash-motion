"use client";

import { Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Table, { type CustomerItem } from "@/components/dashboard/pages/seller/customers/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EnterprisePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const tableDataRef = useRef<CustomerItem[]>([]);

  const handleDataChange = useCallback((data: CustomerItem[]) => {
    tableDataRef.current = data;
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Meus clientes</h1>
          <p className="text-muted-foreground text-sm">Veja os clientes que compraram seus produtos</p>
        </div>

        <div className="flex w-1/2 justify-end items-center gap-2">
          <span>Ordenar por</span>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mais recente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recente</SelectItem>
              <SelectItem value="oldest">Mais antigo</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Table searchQuery={searchQuery} sortOrder={sortOrder} onDataChange={handleDataChange} />
      </div>
    </div>
  );
}
