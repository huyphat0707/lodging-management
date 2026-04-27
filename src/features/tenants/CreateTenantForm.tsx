"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { tenantsApi } from "@/lib/api/tenants";
import { propertiesApi } from "@/lib/api/properties";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { selectFieldClass } from "@/features/properties/property-form-styles";

export function CreateTenantForm() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const tenantSchema = z.object({
    name: z.string().min(2, t("validation.minLength", { min: 2 })),
    phone: z.string().min(10, t("validation.minLength", { min: 10 })),
    email: z.string().email(t("validation.email")).optional().or(z.literal("")),
    propertyId: z.string().min(1, t("validation.selectProperty")),
    status: z.enum(["Active", "Pending", "Inactive"]),
  });

  type TenantFormValues = z.infer<typeof tenantSchema>;

  const form = useForm<TenantFormValues>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      propertyId: "",
      status: "Active",
    },
  });

  const { data: propertiesResponse } = useQuery({
    queryKey: ["properties"],
    queryFn: () => propertiesApi.getProperties(),
  });
  const properties = propertiesResponse?.data || [];

  const mutation = useMutation({
    mutationFn: (data: TenantFormValues) => tenantsApi.createTenant(data),
    onSuccess: () => {
      toast.success(t("tenants.createSuccess") || "Tenant created successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create tenant");
    },
  });

  const onSubmit = (data: TenantFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="rounded-lg border bg-card p-4 md:p-6">
      <h3 className="text-lg font-semibold">{t("tenants.createTenant")}</h3>
      <p className="text-sm text-muted-foreground">
        {t("tenants.createTenantDescription")}
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            {t("tenants.fullName")}
          </label>
          <Input 
            id="name" 
            {...form.register("name")} 
            placeholder="e.g. Nguyen Van A" 
            className={form.formState.errors.name ? "border-red-500" : ""}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium">
            {t("tenants.phone")}
          </label>
          <Input 
            id="phone" 
            {...form.register("phone")} 
            placeholder="+84..." 
            className={form.formState.errors.phone ? "border-red-500" : ""}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            {t("tenants.email")}
          </label>
          <Input id="email" {...form.register("email")} type="email" placeholder="tenant@email.com" />
        </div>

        <div className="grid gap-2">
          <label htmlFor="propertyId" className="text-sm font-medium">
            {t("tenants.property")}
          </label>
          <select
            id="propertyId"
            className={selectFieldClass}
            {...form.register("propertyId")}
          >
            <option value="">{t("tenants.propertyPlaceholder") || "Select a property"}</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("tenants.createTenant")}
          </Button>
        </div>
      </form>
    </div>
  );
}
