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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PaymentHistoryTable() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: paymentsResponse, isLoading, isError } = useQuery({
    queryKey: ["payments", page, limit],
    queryFn: () => (api.getPayments as any)({ page, limit }),
  });

  const payments = paymentsResponse?.data || [];
  const meta = (paymentsResponse as any)?.meta || { current_page: 1, total_pages: 1 };

  if (isLoading) {
    return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">{t("billing.loading")}</div>;
  }

  if (isError) {
    return <div className="rounded-md border bg-card p-4 text-sm text-red-600">{t("billing.error")}</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("billing.invoiceId")}</TableHead>
            <TableHead>{t("billing.amount")}</TableHead>
            <TableHead>{t("billing.paymentMethod")}</TableHead>
            <TableHead>{t("billing.paidDate")}</TableHead>
            <TableHead>{t("billing.transactionId")}</TableHead>
            <TableHead>{t("billing.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment: any) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.invoiceId}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.paymentMethod}</TableCell>
              <TableCell>{payment.paidDate || "—"}</TableCell>
              <TableCell className="text-xs">{payment.transactionId}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    payment.status === "Completed"
                      ? "default"
                      : payment.status === "Pending"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {t(`billing.paymentStatus${payment.status}`)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("app.previous") || "Trước"}
        </Button>
        <div className="text-sm text-muted-foreground mx-2">
          {t("app.page") || "Trang"} {meta.current_page} / {meta.total_pages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (meta.total_pages || 1)}
        >
          {t("app.next") || "Sau"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
