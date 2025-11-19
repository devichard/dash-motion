"use client";

import { EllipsisIcon, Settings, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Column, DataTable, formatDateTime } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";

export interface TeamMember {
  uuid: string;
  id: string;
  name: string;
  email: string;
  image: string;
  role: "Super-Administrador" | "Administrador" | "Gerente";
  created: Date;
}

interface TableTeamProps {
  roleFilter: string;
  searchQuery: string;
  openAddMemberDialog: boolean;
  onOpenAddMemberDialogChange: (open: boolean) => void;
}

const mockTeamMembers: TeamMember[] = [
  {
    uuid: "1",
    id: "1",
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    image: "/img/logo-green-background.png",
    role: "Super-Administrador",
    created: new Date("2024-01-15"),
  },
  {
    uuid: "2",
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@exemplo.com",
    image: "/img/logo-green-background.png",
    role: "Administrador",
    created: new Date("2024-02-20"),
  },
  {
    uuid: "3",
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@exemplo.com",
    image: "/img/logo-green-background.png",
    role: "Gerente",
    created: new Date("2024-03-10"),
  },
];

export default function TableTeam({
  roleFilter,
  searchQuery,
  openAddMemberDialog,
  onOpenAddMemberDialogChange,
}: TableTeamProps) {
  const { user } = useAuth();
  const currentUserRole = (user?.role as TeamMember["role"]) || "Gerente";

  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPassword, setNewMemberPassword] = useState("");
  const [newMemberRole, setNewMemberRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const _canCreateMembers = () => {
    return currentUserRole === "Super-Administrador" || currentUserRole === "Administrador";
  };

  const canEditMember = (member: TeamMember) => {
    if (currentUserRole === "Super-Administrador") return true;
    if (currentUserRole === "Administrador") {
      return member.role !== "Super-Administrador";
    }
    return false;
  };

  const canDeleteMember = (member: TeamMember) => {
    if (currentUserRole === "Super-Administrador") return true;
    if (currentUserRole === "Administrador") {
      return member.role !== "Super-Administrador";
    }
    return false;
  };

  const canChangeRole = (member: TeamMember, newRole: string) => {
    if (currentUserRole === "Super-Administrador") return true;
    if (currentUserRole === "Administrador") {
      if (member.role === "Super-Administrador") return false;
      if (newRole === "Super-Administrador") return false;
      return true;
    }
    return false;
  };

  const getAvailableRoles = () => {
    if (currentUserRole === "Super-Administrador") {
      return ["Super-Administrador", "Administrador", "Gerente"];
    }
    if (currentUserRole === "Administrador") {
      return ["Administrador", "Gerente"];
    }
    return [];
  };

  const handleOpenRoleDialog = (member: TeamMember) => {
    if (!canEditMember(member)) {
      toast.error("Você não tem permissão para alterar este membro");
      return;
    }
    setSelectedMember(member);
    setSelectedRole(member.role);
    setOpenRoleDialog(true);
  };

  const handleOpenDeleteDialog = (member: TeamMember) => {
    if (!canDeleteMember(member)) {
      toast.error("Você não tem permissão para remover este membro");
      return;
    }
    setSelectedMember(member);
    setOpenDeleteDialog(true);
  };

  const handleSaveRole = () => {
    if (!selectedMember) return;

    if (!canChangeRole(selectedMember, selectedRole)) {
      toast.error("Você não tem permissão para alterar para este cargo");
      return;
    }

    setMembers((prev) =>
      prev.map((member) =>
        member.uuid === selectedMember.uuid ? { ...member, role: selectedRole as TeamMember["role"] } : member,
      ),
    );

    toast.success(`Perfil de ${selectedMember.name} atualizado para ${selectedRole}`);
    setOpenRoleDialog(false);
    setSelectedMember(null);
    setSelectedRole("");
  };

  const handleDeleteMember = () => {
    if (!selectedMember) return;

    setMembers((prev) => prev.filter((member) => member.uuid !== selectedMember.uuid));

    toast.success(`Membro ${selectedMember.name} removido com sucesso`);
    setOpenDeleteDialog(false);
    setSelectedMember(null);
  };

  const handleCreateMember = async () => {
    if (!newMemberName.trim()) {
      toast.error("Por favor, preencha o nome completo");
      return;
    }

    if (!newMemberEmail.trim()) {
      toast.error("Por favor, preencha o e-mail");
      return;
    }

    if (!newMemberPassword.trim() || newMemberPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (!newMemberRole) {
      toast.error("Por favor, selecione um cargo");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newMember: TeamMember = {
        uuid: Date.now().toString(),
        id: Date.now().toString(),
        name: newMemberName,
        email: newMemberEmail,
        image: "/img/logo-green-background.png",
        role: newMemberRole as TeamMember["role"],
        created: new Date(),
      };

      setMembers((prev) => [...prev, newMember]);

      toast.success(
        `Membro ${newMemberName} criado com sucesso. O usuário pode fazer login com o e-mail e senha fornecidos.`,
      );
      handleCloseAddMemberDialog();
    } catch (error) {
      toast.error("Erro ao criar membro. Tente novamente.");
      console.error("Error creating member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAddMemberDialog = () => {
    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberPassword("");
    setNewMemberRole("");
    onOpenAddMemberDialogChange(false);
  };

  const getRoleBadgeColor = (role: TeamMember["role"]) => {
    switch (role) {
      case "Super-Administrador":
        return "bg-red-500";
      case "Administrador":
        return "bg-green-500";
      case "Gerente":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns: Column<TeamMember>[] = [
    {
      header: "Membro",
      accessor: (item) => (
        <div className="flex items-center gap-3">
          <Image className="rounded-full" src={item.image} width={40} height={40} alt={item.name} />
          <div>
            <div className="font-medium">{item.name}</div>
            <span className="text-muted-foreground mt-0.5 text-xs">{item.email}</span>
          </div>
        </div>
      ),
      className: "px-4",
    },
    {
      header: "Cargo / Perfil",
      accessor: (item) => (
        <Badge variant="outline" className="gap-1.5">
          <span className={`size-1.5 rounded-full ${getRoleBadgeColor(item.role)}`} aria-hidden="true"></span>
          {item.role}
        </Badge>
      ),
    },
    {
      header: "Adicionado em",
      accessor: (item) => formatDateTime(item.created),
    },
    {
      header: "Ação",
      accessor: (item) => renderActions(item),
      className: "text-right px-4",
    },
  ];

  const filterFunction = (item: TeamMember) => {
    const matchesRole = roleFilter === "all" || item.role === roleFilter;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  };

  const renderActions = (item: TeamMember) => {
    const canEdit = canEditMember(item);
    const canDelete = canDeleteMember(item);

    return (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="shadow-none" aria-label="Ações">
              <EllipsisIcon size={16} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-foreground">{item.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{item.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {canEdit ? (
              <DropdownMenuItem onClick={() => handleOpenRoleDialog(item)}>
                <Settings />
                Alterar Cargo
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <Settings />
                Alterar Cargo
              </DropdownMenuItem>
            )}
            {canDelete ? (
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleOpenDeleteDialog(item)}
                className="text-destructive"
              >
                <Trash2 />
                Remover
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled variant="destructive" className="text-destructive/50">
                <Trash2 />
                Remover
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  };

  const sortFunction = (a: TeamMember, b: TeamMember) => b.created.getTime() - a.created.getTime();

  const availableRoles = getAvailableRoles();

  return (
    <>
      <DataTable
        data={members}
        columns={columns}
        itemsPerPage={9}
        emptyMessage="Nenhum membro da equipe encontrado"
        onFilter={filterFunction}
        onSort={sortFunction}
      />

      <Dialog open={openAddMemberDialog} onOpenChange={onOpenAddMemberDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Membro</DialogTitle>
            <DialogDescription>
              Preencha as informações abaixo para criar um novo membro. O usuário poderá fazer login com o e-mail e
              senha fornecidos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                placeholder="Digite o nome completo"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite o e-mail"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha"
                value={newMemberPassword}
                onChange={(e) => setNewMemberPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                O usuário usará este e-mail e senha para fazer login na plataforma
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Cargo / Perfil *</Label>
              <Select value={newMemberRole} onValueChange={setNewMemberRole} disabled={availableRoles.length === 0}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableRoles.length === 0 && (
                <p className="text-xs text-muted-foreground">Você não tem permissão para criar membros</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAddMemberDialog} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleCreateMember} disabled={isSubmitting || availableRoles.length === 0}>
              {isSubmitting ? "Criando..." : "Criar Membro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openRoleDialog} onOpenChange={setOpenRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Cargo do Membro</DialogTitle>
            <DialogDescription>
              Selecione o novo cargo para <span className="font-semibold text-foreground">{selectedMember?.name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="role-edit">Cargo / Perfil</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole} disabled={availableRoles.length === 0}>
                <SelectTrigger id="role-edit">
                  <SelectValue placeholder="Selecione um cargo" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableRoles.length === 0 && (
                <p className="text-xs text-muted-foreground">Você não tem permissão para alterar cargos</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRoleDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveRole}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Membro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover{" "}
              <span className="font-semibold text-foreground">{selectedMember?.name}</span> ({selectedMember?.email}) da
              equipe? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
