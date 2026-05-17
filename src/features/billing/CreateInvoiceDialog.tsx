"use client";

import { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
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
import { Plus, Loader2 } from "lucide-react";
import { contractsApi } from "@/lib/api/contracts";
import { billingApi } from "@/lib/api/billing";
import { propertiesApi } from "@/lib/api/properties";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/utils";
import { usePropertyContext } from "@/components/providers/PropertyContext";
import { useEffect } from "react";

export function CreateInvoiceDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { selectedPropertyType } = usePropertyContext();
  const isBoarding = selectedPropertyType === "Boarding";

  const invoiceSchema = z.object({
    propertyId: z.string().min(1, t("validation.required")),
    tenantId: z.string().min(1, t("validation.required")),
    roomId: z.string().min(1, t("validation.required")),
    totalAmount: z.string().min(1, t("validation.required")),
    dueDate: z.string().min(1, t("validation.required")),
    notes: z.string().optional(),
    elecOld: z.string().optional(),
    elecNew: z.string().optional(),
    waterOld: z.string().optional(),
    waterNew: z.string().optional(),
    month: z.string().optional(),
    year: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (isBoarding) {
      if (!data.elecNew) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required") || "Vui lòng nhập chỉ số mới",
          path: ["elecNew"],
        });
      } else if (data.elecOld && Number(data.elecNew) < Number(data.elecOld)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("billing.indexInvalid") || "Chỉ số mới không được nhỏ hơn chỉ số cũ",
          path: ["elecNew"],
        });
      }

      if (!data.waterNew) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("validation.required") || "Vui lòng nhập chỉ số mới",
          path: ["waterNew"],
        });
      } else if (data.waterOld && Number(data.waterNew) < Number(data.waterOld)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("billing.indexInvalid") || "Chỉ số mới không được nhỏ hơn chỉ số cũ",
          path: ["waterNew"],
        });
      }
    }
  });

  type InvoiceFormValues = z.infer<typeof invoiceSchema>;

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    mode: "onChange",
    defaultValues: {
      propertyId: "",
      tenantId: "",
      roomId: "",
      totalAmount: "",
      dueDate: "",
      notes: "",
      elecOld: "",
      elecNew: "",
      waterOld: "",
      waterNew: "",
      month: String(new Date().getMonth() + 1),
      year: String(new Date().getFullYear()),
    },
  });

  const selectedPropertyId = form.watch("propertyId");
  const selectedTenantId = form.watch("tenantId");
  const selectedRoomId = form.watch("roomId");

  const elecOld = form.watch("elecOld");
  const elecNew = form.watch("elecNew");
  const waterOld = form.watch("waterOld");
  const waterNew = form.watch("waterNew");

  // Fetch properties filtered by type
  const { data: propertiesResponse } = useQuery({
    queryKey: ["properties", selectedPropertyType],
    queryFn: () => propertiesApi.getPropertiesByType(selectedPropertyType as any),
  });
  const properties = propertiesResponse?.data || [];

  // Fetch active contracts
  const { data: contractsResponse } = useQuery({
    queryKey: ["contracts", "active"],
    queryFn: () => contractsApi.getContracts({ status: "Active", limit: 100 }),
  });

  const activeContracts = contractsResponse?.data || [];

  const tenantOptions = useMemo(() => {
    const seen = new Set<string>();
    return activeContracts
      .filter((c: any) => {
        if (!c.tenant || seen.has(c.tenantId)) return false;
        if (selectedPropertyId && c.propertyId !== selectedPropertyId) return false;
        seen.add(c.tenantId);
        return true;
      })
      .map((c: any) => ({
        id: c.tenantId,
        name: c.tenant?.name || "-",
        roomId: c.roomId,
        roomNumber: c.room?.roomNumber || c.room?.room_number || "-",
        propertyId: c.propertyId,
        propertyName: c.property?.name || "-",
        monthlyRate: c.monthlyRate || c.monthly_rate,
        electricityPrice: c.room?.electricityPrice || c.room?.electricity_price || 0,
        waterPrice: c.room?.waterPrice || c.room?.water_price || 0,
      }));
  }, [activeContracts, selectedPropertyId]);

  const roomOptions = useMemo(() => {
    const seen = new Set<string>();
    return activeContracts
      .filter((c: any) => {
        if (!c.room || seen.has(c.roomId)) return false;
        if (selectedPropertyId && c.propertyId !== selectedPropertyId) return false;
        seen.add(c.roomId);
        return true;
      })
      .map((c: any) => ({
        id: c.roomId,
        roomNumber: c.room?.roomNumber || c.room?.room_number || "-",
        tenantId: c.tenantId,
        tenantName: c.tenant?.name || "-",
        propertyId: c.propertyId,
        propertyName: c.property?.name || "-",
        monthlyRate: c.monthlyRate || c.monthly_rate,
        electricityPrice: c.room?.electricityPrice || c.room?.electricity_price || 0,
        waterPrice: c.room?.waterPrice || c.room?.water_price || 0,
      }));
  }, [activeContracts, selectedPropertyId]);

  // Fetch invoices for the selected property to find the previous meter readings
  const { data: previousInvoicesResponse } = useQuery({
    queryKey: ["invoices", "property", selectedPropertyId],
    queryFn: () => billingApi.getInvoices({ propertyId: selectedPropertyId, limit: 100 }),
    enabled: !!selectedPropertyId && isBoarding,
  });

  // Auto-fill old indexes when a room is selected
  useEffect(() => {
    if (isBoarding && selectedRoomId && previousInvoicesResponse?.data) {
      const roomInvoices = previousInvoicesResponse.data.filter(
        (inv: any) => inv.roomId === selectedRoomId || inv.room_id === selectedRoomId
      );

      if (roomInvoices.length > 0) {
        // Lấy hóa đơn tạo gần đây nhất
        const latestInvoice = roomInvoices.sort((a: any, b: any) => {
          const dateA = new Date(a.issueDate || a.created_at || 0).getTime();
          const dateB = new Date(b.issueDate || b.created_at || 0).getTime();
          return dateB - dateA; // Descending
        })[0];

        const oldElec = (latestInvoice as any).electricityNewIndex ?? (latestInvoice as any).electricity_new_index;
        const oldWater = (latestInvoice as any).waterNewIndex ?? (latestInvoice as any).water_new_index;

        if (oldElec !== undefined && oldElec !== null) {
          form.setValue("elecOld", String(Number(oldElec)));
        }
        if (oldWater !== undefined && oldWater !== null) {
          form.setValue("waterOld", String(Number(oldWater)));
        }
      } else {
        // Reset nếu không có hóa đơn cũ
        form.setValue("elecOld", "0");
        form.setValue("waterOld", "0");
      }
    }
  }, [selectedRoomId, previousInvoicesResponse, isBoarding, form]);

  // Auto calculate total amount for Boarding House
  useEffect(() => {
    if (!isBoarding || !selectedRoomId) return;
    const match = roomOptions.find((r: any) => r.id === selectedRoomId);
    if (!match) return;

    let base = match.monthlyRate ? parseFloat(match.monthlyRate) : 0;
    let elec = 0;
    let water = 0;

    if (elecOld && elecNew && Number(elecNew) >= Number(elecOld)) {
      elec = (Number(elecNew) - Number(elecOld)) * Number(match.electricityPrice);
    }
    if (waterOld && waterNew && Number(waterNew) >= Number(waterOld)) {
      water = (Number(waterNew) - Number(waterOld)) * Number(match.waterPrice);
    }

    form.setValue("totalAmount", String(Math.round(base + elec + water)));
  }, [elecOld, elecNew, waterOld, waterNew, selectedRoomId, isBoarding, roomOptions, form]);

  const handlePropertyChange = (propertyId: string) => {
    form.setValue("propertyId", propertyId);
    form.setValue("tenantId", "");
    form.setValue("roomId", "");
    if (!isBoarding) form.setValue("totalAmount", "");
  };

  // When tenant is selected → auto-fill room, property, and amount
  const handleTenantChange = (tenantId: string) => {
    form.setValue("tenantId", tenantId);
    const match = tenantOptions.find((t: any) => t.id === tenantId);
    if (match) {
      form.setValue("roomId", match.roomId);
      if (!selectedPropertyId) {
        form.setValue("propertyId", match.propertyId);
      }
      if (match.monthlyRate) {
        form.setValue("totalAmount", String(Math.round(parseFloat(match.monthlyRate))));
      }
    }
  };

  // When room is selected → auto-fill tenant, property, and amount
  const handleRoomChange = (roomId: string) => {
    form.setValue("roomId", roomId);
    const match = roomOptions.find((r: any) => r.id === roomId);
    if (match) {
      form.setValue("tenantId", match.tenantId);
      if (!selectedPropertyId) {
        form.setValue("propertyId", match.propertyId);
      }
      if (match.monthlyRate) {
        form.setValue("totalAmount", String(Math.round(parseFloat(match.monthlyRate))));
      }
    }
  };

  const createMutation = useMutation({
    mutationFn: (values: any) => {
      const { elecOld, elecNew, waterOld, waterNew, month, year, ...apiData } = values;
      return billingApi.createInvoice(apiData);
    },
    onSuccess: async (data: any, variables: any) => {
      const invoiceId = data.id || data.data?.id || data.data?.[0]?.id;
      if (isBoarding && invoiceId && (variables.elecNew || variables.waterNew)) {
        try {
          await billingApi.updateMeterReadings(invoiceId, {
            elecOld: Number(variables.elecOld || 0),
            elecNew: Number(variables.elecNew || 0),
            waterOld: Number(variables.waterOld || 0),
            waterNew: Number(variables.waterNew || 0),
          });
        } catch (e) {
          console.error("Failed to update meter readings", e);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(t("billing.createSuccess") || "Invoice created successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create invoice");
    },
  });

  function onSubmit(values: InvoiceFormValues) {
    const now = new Date();

    // Nếu là phòng trọ, tạo tên hóa đơn có chứa tháng/năm
    const invoicePrefix = isBoarding && values.month && values.year
      ? `INV-${values.year}${values.month.padStart(2, "0")}`
      : `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;

    const submitData = {
      ...values,
      totalAmount: Number(values.totalAmount),
      paidAmount: 0,
      issueDate: isBoarding && values.year && values.month
        ? `${values.year}-${values.month.padStart(2, "0")}-01`
        : now.toISOString().split("T")[0],
      invoiceNumber: `${invoicePrefix}-${Date.now().toString().slice(-4)}`,
      status: "Unpaid",
    };
    createMutation.mutate(submitData);
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("billing.createInvoice")}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("billing.createInvoiceTitle")}</DialogTitle>
              <DialogDescription>{t("billing.createInvoiceDescription")}</DialogDescription>
            </DialogHeader>

            {activeContracts.length === 0 ? (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                {t("billing.noActiveContracts") || "Không có hợp đồng đang hoạt động. Vui lòng tạo hợp đồng trước khi tạo hóa đơn."}
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="propertyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("billing.property") || "Cơ sở lưu trú"}</FormLabel>
                      <Select onValueChange={handlePropertyChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("rooms.propertyPlaceholder") || "Chọn cơ sở"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((p: any) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tenantId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("billing.tenant")}</FormLabel>
                        <Select
                          onValueChange={handleTenantChange}
                          value={field.value}
                          disabled={!selectedPropertyId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("billing.tenantPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tenantOptions.map((ten: any) => (
                              <SelectItem key={ten.id} value={ten.id}>
                                {ten.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="roomId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("billing.room")}</FormLabel>
                        <Select
                          onValueChange={handleRoomChange}
                          value={field.value}
                          disabled={!selectedPropertyId}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("billing.roomPlaceholder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roomOptions.map((r: any) => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.roomNumber} — {r.tenantName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Show matched info */}
                {selectedTenantId && selectedRoomId && (
                  <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                    {(() => {
                      const match = tenantOptions.find((t: any) => t.id === selectedTenantId);
                      if (match) {
                        return `${match.propertyName} — Phòng ${match.roomNumber} — Khách: ${match.name}`;
                      }
                      return null;
                    })()}
                  </div>
                )}

                {isBoarding && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="month"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("billing.month") || "Kỳ thanh toán (Tháng)"}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => (
                                <SelectItem key={i + 1} value={String(i + 1)}>
                                  Tháng {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("billing.year") || "Năm"}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {isBoarding && (
                  <>
                    <div className="space-y-3 rounded-md border p-3">
                      <h4 className="text-sm font-semibold">{t("rooms.electricityPrice") || "Điện"}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="elecOld"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("billing.oldIndex") || "Chỉ số cũ"}</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="elecNew"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("billing.newIndex") || "Chỉ số mới"}</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 rounded-md border p-3">
                      <h4 className="text-sm font-semibold">{t("rooms.waterPrice") || "Nước"}</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="waterOld"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("billing.oldIndex") || "Chỉ số cũ"}</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="waterNew"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("billing.newIndex") || "Chỉ số mới"}</FormLabel>
                              <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("billing.amount")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="0"
                            {...field}
                            readOnly={isBoarding}
                            className={isBoarding ? "bg-muted font-semibold text-primary" : ""}
                            onChange={(e) => {
                              if (isBoarding) return;
                              const formatted = formatCurrencyInput(e.target.value);
                              field.onChange(parseCurrencyInput(formatted));
                            }}
                            value={formatCurrencyInput(field.value ?? "")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("billing.dueDate")}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("billing.invoiceDescription")}</FormLabel>
                      <FormControl>
                        <textarea
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-20"
                          placeholder={t("billing.descriptionPlaceholder")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("billing.save")}
                  </Button>
                </DialogFooter>
              </>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

