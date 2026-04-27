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

export function PaymentHistoryTable() {
  const { t } = useI18n();
  const { data: payments = [], isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: api.getPayments,
  });

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
          {payments.map((payment) => (
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
    </div>
  );
}
