"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useI18n } from "@/components/providers/LanguageProvider";
import type { TaskStatus } from "@/lib/api/types";

function taskStatusVariant(status: TaskStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Done":
      return "default";
    case "Cancelled":
      return "destructive";
    case "InProgress":
      return "secondary";
    default:
      return "outline";
  }
}

function taskStatusLabel(status: TaskStatus, t: (k: string) => string) {
  const keys: Record<TaskStatus, string> = {
    Todo: "tasks.statusTodo",
    InProgress: "tasks.statusInProgress",
    Done: "tasks.statusDone",
    Cancelled: "tasks.statusCancelled",
  };
  return t(keys[status]);
}

function priorityLabel(priority: string, t: (k: string) => string) {
  const keys: Record<string, string> = {
    Low: "tasks.priorityLow",
    Normal: "tasks.priorityNormal",
    High: "tasks.priorityHigh",
  };
  return t(keys[priority] || priority);
}

export function TaskTable() {
  const { t } = useI18n();

  const { data: tasks = [], isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: api.getTasks,
  });

  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
        {t("tasks.loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-border bg-card p-4 text-sm text-destructive">
        {t("tasks.error")}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("tasks.titleField")}</TableHead>
            <TableHead>{t("tasks.property")}</TableHead>
            <TableHead>{t("tasks.room")}</TableHead>
            <TableHead>{t("tasks.dueDate")}</TableHead>
            <TableHead>{t("tasks.status")}</TableHead>
            <TableHead>{t("tasks.priority")}</TableHead>
            <TableHead>{t("tasks.assignee")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.title}</TableCell>
              <TableCell className="text-sm">{row.property}</TableCell>
              <TableCell>{row.room || "—"}</TableCell>
              <TableCell>{row.dueDate}</TableCell>
              <TableCell>
                <Badge variant={taskStatusVariant(row.status)}>{taskStatusLabel(row.status, t)}</Badge>
              </TableCell>
              <TableCell>
                <span
                  className={
                    row.priority === "High"
                      ? "text-destructive text-sm font-medium"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {priorityLabel(row.priority, t)}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.assignee || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
