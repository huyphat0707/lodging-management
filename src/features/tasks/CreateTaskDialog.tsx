"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { selectFieldClass } from "@/features/properties/property-form-styles";
import type { TaskStatus } from "@/lib/api/types";

export function CreateTaskDialog() {
  const { t } = useI18n();

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        {t("tasks.addTask")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("tasks.createTitle")}</DialogTitle>
          <DialogDescription>{t("tasks.createDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="task-title" className="text-sm font-medium">
              {t("tasks.titleField")}
            </label>
            <Input id="task-title" placeholder={t("tasks.titlePlaceholder")} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="task-property" className="text-sm font-medium">
              {t("tasks.property")}
            </label>
            <Input id="task-property" placeholder="e.g. Sunrise Homestay" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="task-room" className="text-sm font-medium">
              {t("tasks.room")}
            </label>
            <Input id="task-room" placeholder="101" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="task-due" className="text-sm font-medium">
              {t("tasks.dueDate")}
            </label>
            <Input id="task-due" type="date" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="task-status" className="text-sm font-medium">
              {t("tasks.status")}
            </label>
            <select id="task-status" className={selectFieldClass} defaultValue="Todo">
              <option value="Todo">{t("tasks.statusTodo")}</option>
              <option value="InProgress">{t("tasks.statusInProgress")}</option>
              <option value="Done">{t("tasks.statusDone")}</option>
              <option value="Cancelled">{t("tasks.statusCancelled")}</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="task-priority" className="text-sm font-medium">
              {t("tasks.priority")}
            </label>
            <select id="task-priority" className={selectFieldClass} defaultValue="Normal">
              <option value="Low">{t("tasks.priorityLow")}</option>
              <option value="Normal">{t("tasks.priorityNormal")}</option>
              <option value="High">{t("tasks.priorityHigh")}</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button">{t("tasks.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
