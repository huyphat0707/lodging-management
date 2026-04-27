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
import { billingApi } from "@/lib/api/billing";
import { useI18n } from "@/components/providers/LanguageProvider";

export function InvoiceTable() {
  const { t } = useI18n();
  const { data: invoicesResponse, isLoading, isError } = useQuery({
    queryKey: ["invoices"],
    queryFn: () => billingApi.getInvoices(),
  });
  
  const invoices = invoicesResponse?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

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
            <TableHead>{t("billing.invoiceNumber") || "Invoice No."}</TableHead>
            <TableHead>{t("billing.tenant")}</TableHead>
            <TableHead>{t("billing.room")}</TableHead>
            <TableHead className="text-right">{t("billing.amount")}</TableHead>
            <TableHead>{t("billing.dueDate")}</TableHead>
            <TableHead>{t("billing.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No invoices found.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice: any) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoiceNumber || invoice.id.substring(0, 8)}</TableCell>
                <TableCell>{invoice.tenantName}</TableCell>
                <TableCell>{invoice.roomNumber}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(invoice.totalAmount)}
                </TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === "Paid"
                        ? "default"
                        : invoice.status === "Unpaid" || invoice.status === "Pending"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {t(`billing.status${invoice.status}`) || invoice.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
