"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function SettingsPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h2>
          <p className="text-muted-foreground">{t("settings.description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Placeholder for organization profile, locale, and notification settings.
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
