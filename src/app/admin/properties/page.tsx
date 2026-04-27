"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/components/providers/LanguageProvider";
import { CreatePropertyDialog } from "@/features/properties/CreatePropertyDialog";
import { PropertyTable } from "@/features/properties/PropertyTable";

export default function PropertiesPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("properties.title")}</h2>
            <p className="text-muted-foreground">{t("properties.description")}</p>
          </div>
          <CreatePropertyDialog />
        </div>
        <PropertyTable />
      </div>
    </AppLayout>
  );
}
