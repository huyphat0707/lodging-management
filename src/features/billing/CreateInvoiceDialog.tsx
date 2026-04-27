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

export function CreateInvoiceDialog() {
  const { t } = useI18n();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("billing.createInvoice")}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("billing.createInvoiceTitle")}</DialogTitle>
          <DialogDescription>{t("billing.createInvoiceDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="tenant" className="text-sm font-medium">
              {t("billing.tenant")}
            </label>
            <Input id="tenant" placeholder={t("billing.tenantPlaceholder")} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="room" className="text-sm font-medium">
              {t("billing.room")}
            </label>
            <Input id="room" placeholder={t("billing.roomPlaceholder")} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium">
              {t("billing.amount")}
            </label>
            <Input id="amount" placeholder="$500" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="dueDate" className="text-sm font-medium">
              {t("billing.dueDate")}
            </label>
            <Input id="dueDate" type="date" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              {t("billing.invoiceDescription")}
            </label>
            <textarea
              id="description"
              placeholder={t("billing.descriptionPlaceholder")}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-20"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button">{t("billing.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
