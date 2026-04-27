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

export function CreateServiceDialog() {
  const { t } = useI18n();

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        {t("services.addService")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("services.createTitle")}</DialogTitle>
          <DialogDescription>{t("services.createDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="service-name" className="text-sm font-medium">
              {t("services.name")}
            </label>
            <Input id="service-name" placeholder={t("services.namePlaceholder")} />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="service-type" className="text-sm font-medium">
              {t("services.type")}
            </label>
            <select id="service-type" className={selectFieldClass}>
              <option value="WiFi">{t("services.typeWiFi")}</option>
              <option value="Cleaning">{t("services.typeCleaning")}</option>
              <option value="Laundry">{t("services.typeLaundry")}</option>
              <option value="Parking">{t("services.typeParking")}</option>
              <option value="Security">{t("services.typeSecurity")}</option>
              <option value="Utilities">{t("services.typeUtilities")}</option>
              <option value="Other">{t("services.typeOther")}</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="service-description" className="text-sm font-medium">
              {t("services.serviceDescription")}
            </label>
            <textarea
              id="service-description"
              placeholder={t("services.descriptionPlaceholder")}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-20"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="service-price" className="text-sm font-medium">
              {t("services.price")}
            </label>
            <Input id="service-price" placeholder="$50/month" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button">{t("services.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
