"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { CreateContractDialog } from "@/features/contracts/CreateContractDialog";
import { ContractTable } from "@/features/contracts/ContractTable";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function ContractsPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("contracts.title")}</h2>
          <p className="text-muted-foreground">{t("contracts.description")}</p>
        </div>

        <CreateContractDialog />
        <ContractTable />
      </div>
    </AppLayout>
  );
}
