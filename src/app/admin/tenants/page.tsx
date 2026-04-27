"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { CreateTenantForm } from "@/features/tenants/CreateTenantForm";
import { TenantTable } from "@/features/tenants/TenantTable";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function TenantsPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("tenants.title")}</h2>
          <p className="text-muted-foreground">{t("tenants.description")}</p>
        </div>

        <CreateTenantForm />
        <TenantTable />
      </div>
    </AppLayout>
  );
}
