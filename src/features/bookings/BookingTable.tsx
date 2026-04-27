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
import type { BookingStatus } from "@/lib/api/types";

function bookingStatusVariant(status: BookingStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "CheckedIn":
    case "Confirmed":
      return "default";
    case "Cancelled":
      return "destructive";
    case "CheckedOut":
      return "secondary";
    default:
      return "outline";
  }
}

function bookingStatusLabel(status: BookingStatus, t: (k: string) => string) {
  const keys: Record<BookingStatus, string> = {
    Pending: "bookings.statusPending",
    Confirmed: "bookings.statusConfirmed",
    CheckedIn: "bookings.statusCheckedIn",
    CheckedOut: "bookings.statusCheckedOut",
    Cancelled: "bookings.statusCancelled",
  };
  return t(keys[status]);
}

export function BookingTable() {
  const { t } = useI18n();

  const { data: bookingsResponse, isLoading, isError } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => api.getBookings(),
  });

  const bookings = bookingsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
        {t("bookings.loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-border bg-card p-4 text-sm text-destructive">
        {t("bookings.error")}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("bookings.guest")}</TableHead>
            <TableHead>{t("bookings.room")}</TableHead>
            <TableHead>{t("bookings.property")}</TableHead>
            <TableHead>{t("bookings.checkIn")}</TableHead>
            <TableHead>{t("bookings.checkOut")}</TableHead>
            <TableHead>{t("bookings.status")}</TableHead>
            <TableHead className="text-right">{t("bookings.amount")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.guest}</TableCell>
              <TableCell>{row.room}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.property}</TableCell>
              <TableCell>{row.checkIn}</TableCell>
              <TableCell>{row.checkOut}</TableCell>
              <TableCell>
                <Badge variant={bookingStatusVariant(row.status)}>{bookingStatusLabel(row.status, t)}</Badge>
              </TableCell>
              <TableCell className="text-right font-medium">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
