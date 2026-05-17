"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/lib/api/billing";
import { useI18n } from "@/components/providers/LanguageProvider";
import { MeterReadingDialog } from "./MeterReadingDialog";
import { Activity, Eye, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invoice } from "@/lib/api/types";

export function InvoiceDetailTable() {
  const { t } = useI18n();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [readingOpen, setReadingOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: invoicesData, isLoading, isError } = useQuery({
    queryKey: ["invoices", page, limit],
    queryFn: () => billingApi.getInvoices({ page, limit }),
  });
  const invoices = invoicesData?.data || [];
  const meta = (invoicesData as any)?.meta || { current_page: 1, total_pages: 1 };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleUpdateReadings = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setReadingOpen(true);
  };

  if (isLoading) {
    return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">{t("billing.loading")}</div>;
  }

  if (isError) {
    return <div className="rounded-md border bg-card p-4 text-sm text-red-600">{t("billing.error")}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("billing.invoiceNumber") || "Invoice No."}</TableHead>
              <TableHead>{t("billing.room")}</TableHead>
              <TableHead>{t("billing.tenant")}</TableHead>
              <TableHead className="text-right">{t("billing.amount")}</TableHead>
              <TableHead>{t("billing.dueDate")}</TableHead>
              <TableHead>{t("billing.status")}</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("billing.noInvoices")}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice: any) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoiceNumber || invoice.id.substring(0, 8)}</TableCell>
                  <TableCell>{invoice.room.roomNumber}</TableCell>
                  <TableCell>{invoice.tenant.name}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(invoice.totalAmount)}
                  </TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invoice.status === "Paid"
                          ? "default"
                          : invoice.status === "Pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {t(`billing.status${invoice.status}`) || invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUpdateReadings(invoice)}>
                          <Activity className="mr-2 h-4 w-4" />
                          {t("billing.updateMeterReadings") || "Update Readings"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("billing.viewDetails") || "View Details"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Trước
        </Button>
        <div className="text-sm text-muted-foreground mx-2">
          Trang {meta.current_page} / {meta.total_pages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (meta.total_pages || 1)}
        >
          Sau
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <MeterReadingDialog
        invoice={selectedInvoice}
        open={readingOpen}
        onOpenChange={setReadingOpen}
      />
    </div>
  );
}
