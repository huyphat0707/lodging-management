"use client";

import { useState } from "react";
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
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/utils";
import { api } from "@/lib/api";
import { selectFieldClass } from "@/features/properties/property-form-styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { roomsApi } from "@/lib/api/rooms";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function CreateRoomDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const roomSchema = z.object({
    propertyId: z.string().min(1, t("validation.selectProperty")),
    roomNumber: z.string().min(1, t("validation.required")),
    type: z.string().min(1, t("validation.required")),
    price: z.string().min(1, t("validation.required")),
    status: z.enum(["Occupied", "Available", "Maintenance"]),
    electricityPrice: z.string().optional(),
    waterPrice: z.string().optional(),
  });

  type RoomFormValues = z.infer<typeof roomSchema>;

  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      propertyId: "",
      roomNumber: "",
      type: "",
      price: "",
      status: "Available",
      electricityPrice: "",
      waterPrice: "",
    },
  });

  // Fetch properties to populate selector
  const { data: propertiesResponse } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.getProperties(),
  });
  const properties = propertiesResponse?.data || [];

  const selectedPropertyId = form.watch("propertyId");
  const currentProperty = properties.find((p) => p.id === selectedPropertyId);
  const isBoarding = currentProperty?.type === "Boarding";

  const mutation = useMutation({
    mutationFn: (data: RoomFormValues) => roomsApi.createRoom(data),
    onSuccess: () => {
      toast.success(t("rooms.createSuccess") || "Room created successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create room");
    },
  });

  const onSubmit = (data: RoomFormValues) => {
    const submitData = {
      ...data,
      price: Number(data.price),
      electricityPrice: data.electricityPrice ? Number(data.electricityPrice) : undefined,
      waterPrice: data.waterPrice ? Number(data.waterPrice) : undefined,
    };
    mutation.mutate(submitData as any);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" /> {t("rooms.addRoom")}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("rooms.addRoom")}</DialogTitle>
            <DialogDescription>
              {t("rooms.addRoomDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="propertyId" className="text-sm font-medium">
                {t("rooms.property")}
              </label>
              <select
                id="propertyId"
                className={selectFieldClass}
                {...form.register("propertyId")}
              >
                <option value="">{t("rooms.propertyPlaceholder")}</option>
                {properties.map((prop: any) => (
                  <option key={prop.id} value={prop.id}>
                    {prop.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.propertyId && (
                <span className="text-xs text-red-500">{form.formState.errors.propertyId.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="roomNumber" className="text-sm font-medium">
                {t("rooms.roomNumber")}
              </label>
              <Input 
                id="roomNumber" 
                {...form.register("roomNumber")} 
                placeholder="e.g. 101" 
              />
              {form.formState.errors.roomNumber && (
                <span className="text-xs text-red-500">{form.formState.errors.roomNumber.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                {t("rooms.type")}
              </label>
              <Input id="type" {...form.register("type")} placeholder="e.g. Standard" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="price" className="text-sm font-medium">
                {t("rooms.price")}
              </label>
              <Controller
                control={form.control}
                name="price"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="price"
                    placeholder="e.g. 5.000.000"
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      field.onChange(parseCurrencyInput(formatted));
                    }}
                    value={formatCurrencyInput(field.value ?? "")}
                  />
                )}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                {t("rooms.status")}
              </label>
              <select id="status" className={selectFieldClass} {...form.register("status")}>
                <option value="Available">{t("rooms.statusAvailable")}</option>
                <option value="Occupied">{t("rooms.statusOccupied")}</option>
                <option value="Maintenance">{t("rooms.statusMaintenance")}</option>
              </select>
            </div>

            {isBoarding && (
              <>
                <div className="border-t border-zinc-700 pt-4 mt-2">
                  <h3 className="text-sm font-medium mb-4">{t("rooms.utilities")}</h3>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="electricity" className="text-sm font-medium">
                    {t("rooms.electricityPrice")}
                  </label>
                  <Controller
                    control={form.control}
                    name="electricityPrice"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="electricity"
                        placeholder="e.g. 3.500"
                        onChange={(e) => {
                          const formatted = formatCurrencyInput(e.target.value);
                          field.onChange(parseCurrencyInput(formatted));
                        }}
                        value={formatCurrencyInput(field.value ?? "")}
                      />
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="water" className="text-sm font-medium">
                    {t("rooms.waterPrice")}
                  </label>
                  <Controller
                    control={form.control}
                    name="waterPrice"
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="water"
                        placeholder="e.g. 15.000"
                        onChange={(e) => {
                          const formatted = formatCurrencyInput(e.target.value);
                          field.onChange(parseCurrencyInput(formatted));
                        }}
                        value={formatCurrencyInput(field.value ?? "")}
                      />
                    )}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {t("rooms.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
