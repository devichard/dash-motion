"use client";

import { useState } from "react";
import CreateLinkModal from "@/components/dashboard/pages/seller/payment-links/createLinkModal";
import Table from "@/components/dashboard/pages/seller/payment-links/table";
import { Button } from "@/components/ui/button";

export default function PaymentLinksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Links de Pagamento</h1>
          <p className="text-muted-foreground text-sm">
            Gere cobranças rápidas sem precisar de integração com desenvolvedores.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} variant="primary" className="ml-4">
          Criar novo link
        </Button>
      </div>
      <div className="mt-6">
        <Table />
      </div>
      <CreateLinkModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
