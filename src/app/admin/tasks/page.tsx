"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/components/providers/LanguageProvider";
import { CreateTaskDialog } from "@/features/tasks/CreateTaskDialog";
import { TaskTable } from "@/features/tasks/TaskTable";

export default function TasksPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("tasks.title")}</h2>
            <p className="text-muted-foreground">{t("tasks.description")}</p>
          </div>
          <CreateTaskDialog />
        </div>
        <TaskTable />
      </div>
    </AppLayout>
  );
}
