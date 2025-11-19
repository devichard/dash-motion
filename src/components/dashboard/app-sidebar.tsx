"use client";

import {
  AreaChart,
  ArrowLeftRight,
  BarChart3,
  BookUser,
  Building2,
  Calendar,
  CirclePercent,
  CreditCard,
  DollarSign,
  FileText,
  Handshake,
  Link,
  Megaphone,
  Plug,
  Receipt,
  Sparkle,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type * as React from "react";

import { NavMain } from "@/components/dashboard/sidebar-components/nav-main";
import { NavUser } from "@/components/dashboard/sidebar-components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

const useNavData = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const adminNavItems = [
    {
      title: "Visão Geral",
      url: "/admin/overview",
      icon: BarChart3,
      isActive: pathname.startsWith("/admin/overview"),
    },
    {
      title: "Solicitações KYC",
      url: "/admin/kyc",
      icon: FileText,
      isActive: pathname.startsWith("/admin/kyc"),
    },
    {
      title: "Todas as Empresas",
      url: "/admin/enterprise",
      icon: Building2,
      isActive: pathname.startsWith("/admin/enterprise"),
    },
    {
      title: "Todas as Transações",
      url: "/admin/transactions",
      icon: CreditCard,
      isActive: pathname.startsWith("/admin/transactions"),
    },
    {
      title: "Todos os Saques",
      url: "/admin/withdrawals",
      icon: Wallet,
      isActive: pathname.startsWith("/admin/withdrawals"),
    },
    {
      title: "Faturamento",
      url: "/admin/invoicing",
      icon: Calendar,
      isActive: pathname.startsWith("/admin/invoicing"),
    },
    {
      title: "Lucro por Empresa",
      url: "/admin/company-invoicing",
      icon: DollarSign,
      isActive: pathname.startsWith("/admin/company-invoicing"),
    },
    {
      title: "Adquirente",
      url: "/admin/acquirer",
      icon: CreditCard,
      isActive: pathname.startsWith("/admin/acquirer"),
    },
    {
      title: "Equipes",
      url: "/admin/team",
      icon: Users,
      isActive: pathname.startsWith("/admin/team"),
    },
    {
      title: "Ranking",
      url: "/admin/ranking",
      icon: Trophy,
      isActive: pathname.startsWith("/admin/ranking"),
    },
    {
      title: "Afiliados",
      url: "/admin/affiliates",
      icon: Handshake,
      isActive: pathname.startsWith("/admin/affiliates"),
    },
    {
      title: "Anúncios",
      url: "/admin/ads",
      icon: Megaphone,
      isActive: pathname.startsWith("/admin/ads"),
    },
  ];

  const sellerNavItems = [
    {
      title: "Visão Geral",
      url: "/seller/overview",
      icon: AreaChart,
      isActive: pathname.startsWith("/seller/overview"),
    },
    {
      title: "Recebimentos",
      url: "/seller/receipts",
      icon: Receipt,
      isActive: pathname.startsWith("/seller/receipts"),
    },
    {
      title: "Transações",
      url: "/seller/transactions",
      icon: ArrowLeftRight,
      isActive: pathname.startsWith("/seller/transactions"),
    },
    {
      title: "Taxas",
      url: "/seller/fees",
      icon: CirclePercent,
      isActive: pathname.startsWith("/seller/fees"),
    },
    {
      title: "Meus Clientes",
      url: "/seller/customers",
      icon: BookUser,
      isActive: pathname.startsWith("/seller/customers"),
    },
    {
      title: "Minha Empresa",
      url: "/seller/enterprise",
      icon: Building2,
      isActive: pathname.startsWith("/seller/enterprise"),
    },
    {
      title: "Links de Pagamento",
      url: "/seller/payment-links",
      icon: Link,
      isActive: pathname.startsWith("/seller/payment-links"),
    },
    {
      title: "Integrações",
      url: "/seller/integrations",
      icon: Plug,
      isActive: pathname.startsWith("/seller/integrations"),
    },
    {
      title: "Indique e Ganhe",
      url: "/seller/indications",
      icon: Sparkle,
      disabled: true,
      isActive: pathname.startsWith("/seller/indications"),
    },
    {
      title: "Parceiros",
      url: "/seller/partners",
      icon: Handshake,
      disabled: true,
      isActive: pathname.startsWith("/seller/partners"),
    },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : sellerNavItems;

  return {
    user: {
      name: user?.email?.split("@")[0] || "Usuário",
      email: user?.email || "usuario@exemplo.com",
      avatar: "/img/logo-green-background.png",
    },
    navMain: navItems,
  };
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = useNavData();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
