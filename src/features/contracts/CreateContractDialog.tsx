"use client";

import { useEffect, useState } from "react";
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
import { api } from "@/lib/api";
import { contractsApi } from "@/lib/api/contracts";
import { toast } from "sonner";
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/utils";
import type { Contract } from "@/lib/api/types";

interface CreateContractDialogProps {
  /** If provided, the dialog works in "edit" mode */
  contract?: Contract;
  /** Controlled open state (used for edit mode) */
  open?: boolean;
  /** Controlled open change handler */
  onOpenChange?: (open: boolean) => void;
}

export function CreateContractDialog({ contract, open: controlledOpen, onOpenChange }: CreateContractDialogProps) {
  const { t } = useI18n();
  const [internalOpen, setInternalOpen] = useState(false);
  const queryClient = useQueryClient();

  const isEditing = !!contract;
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const contractSchema = z.object({
    tenantId: z.string().min(1, t("validation.required")),
    roomId: z.string().min(1, t("validation.required")),
    propertyId: z.string().min(1, t("validation.required")),
    startDate: z.string().min(1, t("validation.required")),
    endDate: z.string().optional().or(z.literal("")),
    monthlyRate: z.string().min(1, t("validation.required")),
    depositAmount: z.string().min(1, t("validation.required")),
    notes: z.string().optional(),
  });

  type ContractFormValues = z.infer<typeof contractSchema>;

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      tenantId: "",
      roomId: "",
      propertyId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      monthlyRate: "",
      depositAmount: "",
      notes: "",
    },
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (contract && open) {
      form.reset({
        tenantId: contract.tenantId || "",
        roomId: contract.roomId || "",
        propertyId: contract.propertyId || "",
        startDate: contract.startDate || "",
        endDate: contract.endDate || "",
        monthlyRate: contract.monthlyRate?.toString() || "",
        depositAmount: contract.depositAmount?.toString() || "",
        notes: contract.notes || "",
      });
    }
  }, [contract, open, form]);

  const selectedPropertyId = form.watch("propertyId");

  // Fetch data
  const { data: propertiesData } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.getProperties(),
  });
  const properties = propertiesData?.data || [];

  const { data: roomsData } = useQuery({
    queryKey: ["rooms", selectedPropertyId],
    queryFn: () => api.getRooms({ propertyId: selectedPropertyId }),
    enabled: !!selectedPropertyId,
  });
  const rooms = roomsData?.data || [];

  const availableRooms = isEditing 
    ? rooms.filter((r: any) => r.status === "Available" || r.status === "Trống" || r.id === contract?.roomId)
    : rooms.filter((r: any) => r.status === "Available" || r.status === "Trống");

  const { data: tenantsData } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => api.getTenants(),
  });
  const tenants = tenantsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (values: any) => contractsApi.createContract(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(t("contracts.createSuccess") || "Contract created successfully");
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create contract");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: any) => contractsApi.updateContract(contract!.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success(t("contracts.updateSuccess") || "Contract updated successfully");
      setOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update contract");
    },
  });

  const mutation = isEditing ? updateMutation : createMutation;

  function onSubmit(values: ContractFormValues) {
    const submitData: any = {
      ...values,
      monthlyRate: Number(values.monthlyRate),
      depositAmount: Number(values.depositAmount),
      endDate: values.endDate || undefined,
    };

    if (isEditing) {
      // Only send changed fields for update
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  }

  // Auto-fill room price when room is selected (only in create mode)
  const onRoomChange = (roomId: string) => {
    const room = (rooms as any[]).find((r: any) => r.id === roomId);
    if (room && !isEditing) {
      form.setValue("monthlyRate", room.price.toString());
    }
    form.setValue("roomId", roomId);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && !isEditing) {
      form.reset();
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[540px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t("contracts.editContract") : t("contracts.createTitle")}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? (t("contracts.editDescription") || t("contracts.createDescription"))
                : t("contracts.createDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="propertyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contracts.property")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
              name="roomId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contracts.room")}</FormLabel>
                  <Select 
                    onValueChange={onRoomChange} 
                    value={field.value}
                    disabled={!selectedPropertyId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("contracts.roomPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRooms.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          Hiện không có phòng trống
                        </div>
                      ) : (
                        availableRooms.map((r: any) => (
                          <SelectItem key={r.id} value={r.id}>{r.roomNumber}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tenantId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contracts.tenant")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("contracts.tenantPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tenants.map((ten: any) => (
                      <SelectItem key={ten.id} value={ten.id}>{ten.name}</SelectItem>
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
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contracts.startDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contracts.endDate")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="monthlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contracts.monthlyRate")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="5.000.000" 
                      {...field} 
                      onChange={(e) => {
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
              name="depositAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contracts.depositAmount")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="10.000.000" 
                      {...field} 
                      onChange={(e) => {
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
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("contracts.notes")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("contracts.notesPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("contracts.save")}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );

  // In edit mode, we don't render a trigger — the dialog is controlled externally
  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  // In create mode, render with trigger button
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("contracts.createContract")}
          </Button>
        }
      />
      {dialogContent}
    </Dialog>
  );
}
