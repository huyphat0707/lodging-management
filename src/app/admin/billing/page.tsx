"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { InvoiceDetailTable } from "@/features/billing/InvoiceDetailTable";
import { PaymentHistoryTable } from "@/features/billing/PaymentHistoryTable";
import { CreateInvoiceDialog } from "@/features/billing/CreateInvoiceDialog";
import { GenerateInvoiceDialog } from "@/features/billing/GenerateInvoiceDialog";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BillingPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("billing.title")}</h2>
            <p className="text-muted-foreground">{t("billing.description")}</p>
          </div>
          <div className="flex gap-2">
            <GenerateInvoiceDialog />
            <CreateInvoiceDialog />
          </div>
        </div>

        <div className="space-y-4">
          
          <Tabs defaultValue="invoices" className="w-full">
            <TabsList>
              <TabsTrigger value="invoices">{t("billing.invoices")}</TabsTrigger>
              <TabsTrigger value="payments">{t("billing.payments")}</TabsTrigger>
            </TabsList>
            <TabsContent value="invoices">
              <InvoiceDetailTable />
            </TabsContent>
            <TabsContent value="payments">
              <PaymentHistoryTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
