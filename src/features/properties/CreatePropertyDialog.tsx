"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { usePropertyContext } from "@/components/providers/PropertyContext";
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
import { Plus, Loader2 } from "lucide-react";
import { selectFieldClass } from "@/features/properties/property-form-styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertiesApi } from "@/lib/api/properties";
import { toast } from "sonner";
import { useState } from "react";

export function CreatePropertyDialog() {
  const { t } = useI18n();
  const { selectedPropertyType } = usePropertyContext();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const propertySchema = z.object({
    name: z.string().min(2, t("validation.minLength", { min: 2 })),
    address: z.string().min(5, t("validation.minLength", { min: 5 })),
    type: z.enum(["Boarding", "Hotel", "Homestay"]),
    totalRooms: z.number().min(0, t("validation.number")),
    status: z.enum(["Active", "Inactive", "Draft"]),
    electricityPrice: z.string().optional(),
    waterPrice: z.string().optional(),
  });

  type PropertyFormValues = z.infer<typeof propertySchema>;

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "",
      type: selectedPropertyType,
      totalRooms: 0,
      status: "Active",
      electricityPrice: "",
      waterPrice: "",
    },
  });

  const propertyType = form.watch("type");

  const mutation = useMutation({
    mutationFn: (data: PropertyFormValues) => propertiesApi.createProperty(data),
    onSuccess: () => {
      toast.success(t("properties.createSuccess") || "Property created successfully");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create property");
    },
  });

  const onSubmit = (data: PropertyFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("properties.addProperty")}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{t("properties.createTitle")}</DialogTitle>
            <DialogDescription>{t("properties.createDescription")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="prop-name" className="text-sm font-medium">
                {t("properties.name")}
              </label>
              <Input
                id="prop-name"
                {...form.register("name")}
                placeholder={t("properties.namePlaceholder")}
                className={form.formState.errors.name ? "border-red-500" : ""}
              />
              {form.formState.errors.name && (
                <span className="text-xs text-red-500">{form.formState.errors.name.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="prop-address" className="text-sm font-medium">
                {t("properties.address")}
              </label>
              <Input
                id="prop-address"
                {...form.register("address")}
                placeholder={t("properties.addressPlaceholder")}
                className={form.formState.errors.address ? "border-red-500" : ""}
              />
              {form.formState.errors.address && (
                <span className="text-xs text-red-500">{form.formState.errors.address.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <label htmlFor="prop-type" className="text-sm font-medium">
                {t("properties.type")}
              </label>
              <select
                id="prop-type"
                className={selectFieldClass}
                {...form.register("type")}
              >
                <option value="Boarding">{t("properties.typeBoarding")}</option>
                <option value="Hotel">{t("properties.typeHotel")}</option>
                <option value="Homestay">{t("properties.typeHomestay")}</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="prop-rooms" className="text-sm font-medium">
                {t("properties.totalRooms")}
              </label>
              <Input
                id="prop-rooms"
                type="number"
                {...form.register("totalRooms", { valueAsNumber: true })}
                min={0}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="prop-status" className="text-sm font-medium">
                {t("properties.status")}
              </label>
              <select id="prop-status" className={selectFieldClass} {...form.register("status")}>
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
                  <label htmlFor="electricity" className="text-sm font-medium">
                    {t("properties.electricityPrice")}
                  </label>
                  <Input
                    id="electricity"
                    {...form.register("electricityPrice")}
                    placeholder={t("properties.electricityPlaceholder")}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="water" className="text-sm font-medium">
                    {t("properties.waterPrice")}
                  </label>
                  <Input
                    id="water"
                    {...form.register("waterPrice")}
                    placeholder={t("properties.waterPlaceholder")}
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending} className="min-w-[100px]">
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.saving") || "Saving..."}
                </>
              ) : (
                t("properties.save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
