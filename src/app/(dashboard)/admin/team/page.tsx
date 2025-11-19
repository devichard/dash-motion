"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import Table from "@/components/dashboard/pages/admin/team/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeamPage() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Equipes</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie os membros e permissões da administração do seu sistema
          </p>
        </div>
        <div className="flex w-1/2 justify-end items-center gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos os perfis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os perfis</SelectItem>
              <SelectItem value="Super-Administrador">Super-Administrador</SelectItem>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Gerente">Gerente</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou email"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setOpenAddMemberDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Membro
          </Button>
        </div>
      </div>
      <div className="mt-6">
        <Table
          roleFilter={roleFilter}
          searchQuery={searchQuery}
          openAddMemberDialog={openAddMemberDialog}
          onOpenAddMemberDialogChange={setOpenAddMemberDialog}
        />
      </div>
    </div>
  );
}
