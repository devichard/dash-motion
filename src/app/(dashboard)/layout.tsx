"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { RequireApproval } from "@/components/auth/require-approval";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import HeaderDashboard from "@/components/dashboard/header-dashboard";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (pathname.startsWith("/message")) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [pathname]);

  return (
    <RequireApproval>
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <AppSidebar />
        <SidebarInset>
          <HeaderDashboard />
          <div className="p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RequireApproval>
  );
}
