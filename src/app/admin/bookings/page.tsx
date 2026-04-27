"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/components/providers/LanguageProvider";
import { CreateBookingDialog } from "@/features/bookings/CreateBookingDialog";
import { BookingTable } from "@/features/bookings/BookingTable";

export default function BookingsPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("bookings.title")}</h2>
            <p className="text-muted-foreground">{t("bookings.description")}</p>
          </div>
          <CreateBookingDialog />
        </div>
        <BookingTable />
      </div>
    </AppLayout>
  );
}
