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

export function CreateContractDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const contractSchema = z.object({
    tenantId: z.string().min(1, t("validation.required")),
    roomId: z.string().min(1, t("validation.required")),
    propertyId: z.string().min(1, t("validation.required")),
    startDate: z.string().min(1, t("validation.required")),
    endDate: z.string().min(1, t("validation.required")),
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

  const selectedPropertyId = form.watch("propertyId");

  // Fetch data
  const { data: propertiesData } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.getProperties(),
  });
  const properties = propertiesData?.data || [];

  const { data: roomsData } = useQuery({
    queryKey: ["rooms", selectedPropertyId],
    queryFn: () => api.getRooms({ propertyId: selectedPropertyId, status: "Available" }),
    enabled: !!selectedPropertyId,
  });
  const rooms = roomsData?.data || [];

  const { data: tenantsData } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => api.getTenants(),
  });
  const tenants = tenantsData?.data || [];

  const createMutation = useMutation({
    mutationFn: (values: ContractFormValues) => contractsApi.createContract(values),
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

  function onSubmit(values: ContractFormValues) {
    createMutation.mutate(values);
  }

  // Auto-fill room price when room is selected
  const onRoomChange = (roomId: string) => {
    const room = (rooms as any[]).find((r: any) => r.id === roomId);
    if (room) {
      form.setValue("monthlyRate", room.price.toString());
    }
    form.setValue("roomId", roomId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("contracts.createContract")}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[540px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t("contracts.createTitle")}</DialogTitle>
              <DialogDescription>{t("contracts.createDescription")}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contracts.property")}</FormLabel>
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
                name="roomId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contracts.room")}</FormLabel>
                    <Select 
                      onValueChange={onRoomChange} 
                      defaultValue={field.value}
                      disabled={!selectedPropertyId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("contracts.roomPlaceholder")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rooms.map((r: any) => (
                          <SelectItem key={r.id} value={r.id}>{r.roomNumber}</SelectItem>
                        ))}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Input placeholder="5000000" {...field} />
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
                      <Input placeholder="10000000" {...field} />
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t("contracts.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
