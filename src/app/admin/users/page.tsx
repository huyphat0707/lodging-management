"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { CreateUserDialog } from "@/features/users/CreateUserDialog";
import { UserTable } from "@/features/users/UserTable";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function UsersPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("users.title")}</h2>
          <p className="text-muted-foreground">{t("users.description")}</p>
        </div>

        <CreateUserDialog />
        <UserTable />
      </div>
    </AppLayout>
  );
}
