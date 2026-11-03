"use client";

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
import { Input } from "@/components/ui/input";
import { selectFieldClass } from "@/features/properties/property-form-styles";
import type { Room } from "@/lib/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { roomsApi } from "@/lib/api/rooms";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/utils";

type EditRoomDialogProps = {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function EditRoomForm({ room, onSuccess }: { room: Room; onSuccess: () => void }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  // Fetch properties to populate selector
  const { data: propertiesResponse } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.getProperties(),
  });
  const properties = propertiesResponse?.data || [];

  const editRoomSchema = z.object({
    propertyId: z.string().min(1, t("validation.selectProperty")),
    roomNumber: z.string().min(1, t("validation.required")),
    type: z.string().min(1, t("validation.required")),
    price: z.string().min(1, t("validation.required")),
    status: z.enum(["Occupied", "Available", "Maintenance"]),
    electricityPrice: z.string().optional(),
    waterPrice: z.string().optional(),
  });

  type EditRoomFormValues = z.infer<typeof editRoomSchema>;

  const form = useForm<EditRoomFormValues>({
    resolver: zodResolver(editRoomSchema),
    defaultValues: {
      propertyId: room.propertyId,
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price ? String(room.price) : "",
      status: room.status,
      electricityPrice: room.electricityPrice ? String(room.electricityPrice) : "",
      waterPrice: room.waterPrice ? String(room.waterPrice) : "",
    },
  });

  const selectedPropertyId = form.watch("propertyId");
  const currentProperty = properties.find((p) => p.id === selectedPropertyId);
  const isBoarding = currentProperty?.type === "Boarding";

  const mutation = useMutation({
    mutationFn: (data: EditRoomFormValues) => {
      const { propertyId, ...rest } = data;
      const submitData = {
        ...rest,
        price: Number(data.price),
        electricityPrice: data.electricityPrice ? Number(data.electricityPrice) : undefined,
        waterPrice: data.waterPrice ? Number(data.waterPrice) : undefined,
      };
      return roomsApi.updateRoom(room.id, submitData as any);
    },
    onSuccess: () => {
      toast.success(t("rooms.updateSuccess") || "Cập nhật phòng thành công");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update room");
    },
  });

  const onSubmit = (data: EditRoomFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>{t("rooms.editRoom") || "Sửa phòng"}</DialogTitle>
        <DialogDescription>
          {t("rooms.editRoomDescription") || "Cập nhật thông tin chi tiết cho phòng."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="edit-propertyId" className="text-sm font-medium">
            {t("rooms.property")}
          </label>
          <select
            id="edit-propertyId"
            className={selectFieldClass}
            {...form.register("propertyId")}
            disabled
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
          <label htmlFor="edit-roomNumber" className="text-sm font-medium">
            {t("rooms.roomNumber")}
          </label>
          <Input 
            id="edit-roomNumber" 
            {...form.register("roomNumber")} 
            placeholder="e.g. 101" 
          />
          {form.formState.errors.roomNumber && (
            <span className="text-xs text-red-500">{form.formState.errors.roomNumber.message}</span>
          )}
        </div>
        <div className="grid gap-2">
          <label htmlFor="edit-type" className="text-sm font-medium">
            {t("rooms.type")}
          </label>
          <Input id="edit-type" {...form.register("type")} placeholder="e.g. Standard" />
        </div>
        <div className="grid gap-2">
          <label htmlFor="edit-price" className="text-sm font-medium">
            {t("rooms.price")}
          </label>
          <Controller
            control={form.control}
            name="price"
            render={({ field }) => (
              <Input
                {...field}
                id="edit-price"
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
          <label htmlFor="edit-status" className="text-sm font-medium">
            {t("rooms.status")}
          </label>
          <select id="edit-status" className={selectFieldClass} {...form.register("status")}>
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
              <label htmlFor="edit-electricity" className="text-sm font-medium">
                {t("rooms.electricityPrice")}
              </label>
              <Controller
                control={form.control}
                name="electricityPrice"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="edit-electricity"
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
              <label htmlFor="edit-water" className="text-sm font-medium">
                {t("rooms.waterPrice")}
              </label>
              <Controller
                control={form.control}
                name="waterPrice"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="edit-water"
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
          {t("rooms.save") || "Lưu"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditRoomDialog({ room, open, onOpenChange }: EditRoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        {room && open ? (
          <EditRoomForm
            key={room.id}
            room={room}
            onSuccess={() => onOpenChange(false)}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
