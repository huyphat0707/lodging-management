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
import type { Property, PropertyStatus, PropertyType } from "@/lib/api/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api/properties";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { formatCurrencyInput, parseCurrencyInput } from "@/lib/utils";

type EditPropertyDialogProps = {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function EditPropertyForm({ property, onSuccess }: { property: Property; onSuccess: () => void }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const editPropertySchema = z.object({
    name: z.string().min(2, t("validation.minLength", { min: 2 })),
    address: z.string().min(5, t("validation.minLength", { min: 5 })),
    type: z.enum(["Boarding", "Hotel", "Homestay"]),
    totalRooms: z.number().min(0, t("validation.number")),
    status: z.enum(["Active", "Inactive", "Draft"]),
    electricityPrice: z.string().optional(),
    waterPrice: z.string().optional(),
  });

  type EditPropertyFormValues = z.infer<typeof editPropertySchema>;

  const form = useForm<EditPropertyFormValues>({
    resolver: zodResolver(editPropertySchema),
    defaultValues: {
      name: property.name,
      address: property.address,
      type: property.type,
      totalRooms: property.totalRooms,
      status: property.status,
      electricityPrice: property.electricityPrice || "",
      waterPrice: property.waterPrice || "",
    },
  });

  const propertyType = form.watch("type");

  const mutation = useMutation({
    mutationFn: (data: EditPropertyFormValues) => propertiesApi.updateProperty(property.id, data),
    onSuccess: () => {
      toast.success(t("properties.updateSuccess") || "Property updated successfully");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update property");
    },
  });

  return (
    <form onSubmit={form.handleSubmit((data) => {
      const submitData = {
        ...data,
        electricityPrice: data.electricityPrice ? Number(data.electricityPrice) : undefined,
        waterPrice: data.waterPrice ? Number(data.waterPrice) : undefined,
      };
      mutation.mutate(submitData as any);
    })}>
      <DialogHeader>
        <DialogTitle>{t("properties.editTitle")}</DialogTitle>
        <DialogDescription>{t("properties.editDescription")}</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="edit-prop-name" className="text-sm font-medium">
            {t("properties.name")}
          </label>
          <Input
            id="edit-prop-name"
            {...form.register("name")}
            placeholder={t("properties.namePlaceholder")}
            className={form.formState.errors.name ? "border-red-500" : ""}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="edit-prop-address" className="text-sm font-medium">
            {t("properties.address")}
          </label>
          <Input
            id="edit-prop-address"
            {...form.register("address")}
            placeholder={t("properties.addressPlaceholder")}
            className={form.formState.errors.address ? "border-red-500" : ""}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="edit-prop-type" className="text-sm font-medium">
            {t("properties.type")}
          </label>
          <select
            id="edit-prop-type"
            className={selectFieldClass}
            {...form.register("type")}
          >
            <option value="Boarding">{t("properties.typeBoarding")}</option>
            <option value="Hotel">{t("properties.typeHotel")}</option>
            <option value="Homestay">{t("properties.typeHomestay")}</option>
          </select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="edit-prop-rooms" className="text-sm font-medium">
            {t("properties.totalRooms")}
          </label>
          <Input
            id="edit-prop-rooms"
            type="number"
            {...form.register("totalRooms", { valueAsNumber: true })}
            min={0}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="edit-prop-status" className="text-sm font-medium">
            {t("properties.status")}
          </label>
          <select
            id="edit-prop-status"
            className={selectFieldClass}
            {...form.register("status")}
          >
            <option value="Active">{t("properties.statusActive")}</option>
            <option value="Inactive">{t("properties.statusInactive")}</option>
            <option value="Draft">{t("properties.statusDraft")}</option>
          </select>
        </div>

        {propertyType === "Boarding" && (
          <>
            <div className="border-t border-zinc-700 pt-4 mt-2">
              <h3 className="text-sm font-medium mb-4">{t("rooms.utilities")}</h3>
            </div>
            <div className="grid gap-2">
              <label htmlFor="edit-electricity" className="text-sm font-medium">
                {t("properties.electricityPrice")}
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
                {t("properties.waterPrice")}
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
        <Button type="submit" disabled={mutation.isPending} className="min-w-[100px]">
          {mutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t("properties.saveChanges")
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditPropertyDialog({ property, open, onOpenChange }: EditPropertyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        {property && open ? (
          <EditPropertyForm 
            key={property.id} 
            property={property} 
            onSuccess={() => onOpenChange(false)} 
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
