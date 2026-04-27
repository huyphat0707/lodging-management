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

const selectFieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function CreateUserDialog() {
  const { t } = useI18n();

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        {t("users.createUser")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("users.createTitle")}</DialogTitle>
          <DialogDescription>{t("users.createDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="user-name" className="text-sm font-medium">
              {t("users.name")}
            </label>
            <Input id="user-name" placeholder={t("users.namePlaceholder")} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="user-email" className="text-sm font-medium">
              {t("users.email")}
            </label>
            <Input id="user-email" type="email" placeholder={t("users.emailPlaceholder")} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="user-phone" className="text-sm font-medium">
              {t("users.phone")}
            </label>
            <Input id="user-phone" placeholder={t("users.phonePlaceholder")} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="user-role" className="text-sm font-medium">
              {t("users.role")}
            </label>
            <select id="user-role" className={selectFieldClass} defaultValue="Staff">
              <option value="Admin">{t("users.roleAdmin")}</option>
              <option value="Staff">{t("users.roleStaff")}</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="user-status" className="text-sm font-medium">
              {t("users.status")}
            </label>
            <select id="user-status" className={selectFieldClass} defaultValue="Active">
              <option value="Active">{t("users.statusActive")}</option>
              <option value="Inactive">{t("users.statusInactive")}</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="user-password" className="text-sm font-medium">
              {t("users.password")}
            </label>
            <Input id="user-password" type="password" placeholder={t("users.passwordPlaceholder")} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button">{t("users.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
