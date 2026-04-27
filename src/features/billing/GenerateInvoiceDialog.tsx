"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { billingApi } from "@/lib/api/billing";
import { toast } from "sonner";

export function GenerateInvoiceDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const generateSchema = z.object({
    propertyId: z.string().min(1, t("validation.required")),
    month: z.string().min(1, t("validation.required")),
  });

  type GenerateFormValues = z.infer<typeof generateSchema>;

  const form = useForm<GenerateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      propertyId: "",
      month: new Date().toISOString().substring(0, 7), // YYYY-MM
    },
  });

  const { data: propertiesData } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.getProperties(),
  });
  const properties = propertiesData?.data || [];

  const generateMutation = useMutation({
    mutationFn: (values: GenerateFormValues) => 
      billingApi.generateInvoices(values.propertyId, values.month),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(t("billing.generateSuccess", { count: res.count }) || `Created ${res.count} invoices`);
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to generate invoices");
    },
  });

  function onSubmit(values: GenerateFormValues) {
    generateMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            {t("billing.generateInvoices") || "Generate Monthly Invoices"}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("billing.generateInvoices") || "Generate Monthly Invoices"}</DialogTitle>
              <DialogDescription>
                {t("billing.generateDescription") || "Create draft invoices for all active contracts in this property."}
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>{t("billing.property") || "Property"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("rooms.propertyPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="month"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>{t("billing.month") || "Month"}</FormLabel>
                  <FormControl>
                    <input
                      type="month"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={generateMutation.isPending}>
                {generateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("billing.save") || "Generate"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
