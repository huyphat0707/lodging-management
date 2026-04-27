"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { OccupancyReport } from "@/features/reports/OccupancyReport";
import { RevenueReport } from "@/features/reports/RevenueReport";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function ReportsPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("reports.title")}</h2>
          <p className="text-muted-foreground">{t("reports.description")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <OccupancyReport />
          <RevenueReport />
        </div>
      </div>
    </AppLayout>
  );
}
