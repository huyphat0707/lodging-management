"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { billingApi } from "@/lib/api/billing";
import { Invoice } from "@/lib/api/types";
import { toast } from "sonner";

interface MeterReadingDialogProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MeterReadingDialog({ invoice, open, onOpenChange }: MeterReadingDialogProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const readingSchema = z.object({
    elecOld: z.number().min(0, t("validation.number")),
    elecNew: z.number().min(0, t("validation.number")),
    waterOld: z.number().min(0, t("validation.number")),
    waterNew: z.number().min(0, t("validation.number")),
  });

  type ReadingFormValues = z.infer<typeof readingSchema>;

  const form = useForm<ReadingFormValues>({
    resolver: zodResolver(readingSchema),
    defaultValues: {
      elecOld: invoice?.electricityOldIndex ? Number(invoice.electricityOldIndex) : 0,
      elecNew: invoice?.electricityNewIndex ? Number(invoice.electricityNewIndex) : 0,
      waterOld: invoice?.waterOldIndex ? Number(invoice.waterOldIndex) : 0,
      waterNew: invoice?.waterNewIndex ? Number(invoice.waterNewIndex) : 0,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: ReadingFormValues) => 
      billingApi.updateMeterReadings(invoice!.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices", invoice!.id] });
      toast.success(t("billing.updateSuccess") || "Meter readings updated");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update readings");
    },
  });

  function onSubmit(values: ReadingFormValues) {
    updateMutation.mutate(values);
  }

  if (!invoice) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("billing.updateMeterReadings") || "Update Meter Readings"}</DialogTitle>
              <DialogDescription>
                {t("billing.meterReadingDescription") || `Room: ${invoice.roomNumber} - Tenant: ${invoice.tenantName}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 border-b pb-4">
              <h4 className="text-sm font-semibold">{t("rooms.electricityPrice") || "Electricity"}</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="elecOld"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t("billing.oldIndex") || "Old Index"}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="elecNew"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t("billing.newIndex") || "New Index"}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 pb-2">
              <h4 className="text-sm font-semibold">{t("rooms.waterPrice") || "Water"}</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="waterOld"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t("billing.oldIndex") || "Old Index"}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="waterNew"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>{t("billing.newIndex") || "New Index"}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("billing.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
