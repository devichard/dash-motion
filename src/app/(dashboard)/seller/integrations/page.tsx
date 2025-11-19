"use client";

import IntegrationsContent from "@/components/dashboard/pages/seller/integrations/integrations-content";

export default function IntegrationsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl">Integrações</h1>
          <p className="text-muted-foreground text-sm">Conecte-se às aplicações de terceiros</p>
        </div>
      </div>
      <div className="mt-6">
        <IntegrationsContent />
      </div>
    </div>
  );
}
