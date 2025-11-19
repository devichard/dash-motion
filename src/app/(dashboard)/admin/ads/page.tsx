"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import CreateAdDialog from "@/components/dashboard/pages/admin/ads/create-ad-dialog";
import Table from "@/components/dashboard/pages/admin/ads/table";
import { Button } from "@/components/ui/button";

export default function AdsPage() {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Anúncios</h1>
          <p className="text-muted-foreground text-sm">Crie e gerencie anúncios para aparecer dentro da plataforma</p>
        </div>
        <Button onClick={() => setOpenCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Criar Anúncio
        </Button>
      </div>
      <div className="mt-6">
        <Table />
      </div>
      <CreateAdDialog open={openCreateDialog} onOpenChange={setOpenCreateDialog} />
    </div>
  );
}
