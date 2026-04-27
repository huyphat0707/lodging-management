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
import type { BookingStatus } from "@/lib/api/types";

export function CreateBookingDialog() {
  const { t } = useI18n();

  return (
    <Dialog>
      <DialogTrigger render={<Button />}>
        <Plus className="mr-2 h-4 w-4" />
        {t("bookings.addBooking")}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t("bookings.createTitle")}</DialogTitle>
          <DialogDescription>{t("bookings.createDescription")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label htmlFor="book-guest" className="text-sm font-medium">
              {t("bookings.guest")}
            </label>
            <Input id="book-guest" placeholder={t("bookings.guestPlaceholder")} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="book-room" className="text-sm font-medium">
              {t("bookings.room")}
            </label>
            <Input id="book-room" placeholder="101" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="book-checkin" className="text-sm font-medium">
                {t("bookings.checkIn")}
              </label>
              <Input id="book-checkin" type="date" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="book-checkout" className="text-sm font-medium">
                {t("bookings.checkOut")}
              </label>
              <Input id="book-checkout" type="date" />
            </div>
          </div>
          <div className="grid gap-2">
            <label htmlFor="book-status" className="text-sm font-medium">
              {t("bookings.status")}
            </label>
            <select id="book-status" className={selectFieldClass} defaultValue="Pending">
              <option value="Pending">{t("bookings.statusPending")}</option>
              <option value="Confirmed">{t("bookings.statusConfirmed")}</option>
              <option value="CheckedIn">{t("bookings.statusCheckedIn")}</option>
              <option value="CheckedOut">{t("bookings.statusCheckedOut")}</option>
              <option value="Cancelled">{t("bookings.statusCancelled")}</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button">{t("bookings.save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
