"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { tenantsApi } from "@/lib/api/tenants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useState } from "react";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

export function TenantTable() {
  const { t } = useI18n();
  const [tenantToDelete, setTenantToDelete] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();

  const { data: tenantsResponse, isLoading, isError } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => tenantsApi.getTenants(),
  });
  const tenants = tenantsResponse?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tenantsApi.deleteTenant(id),
    onSuccess: () => {
      toast.success(t("tenants.deleteSuccess") || "Tenant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete tenant");
    },
  });

  const handleDeleteClick = (id: string, name: string) => {
    setTenantToDelete({ id, name });
  };

  const handleConfirmDelete = () => {
    if (tenantToDelete) {
      deleteMutation.mutate(tenantToDelete.id);
      setTenantToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Loading tenants...</div>;
  }

  if (isError) {
    return <div className="rounded-md border bg-card p-4 text-sm text-red-600">Failed to load tenants.</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("tenants.fullName")}</TableHead>
            <TableHead>{t("tenants.roomNumber")}</TableHead>
            <TableHead>{t("tenants.phone")}</TableHead>
            <TableHead>{t("tenants.moveInDate")}</TableHead>
            <TableHead>{t("tenants.status")}</TableHead>
            <TableHead className="text-right">{t("tenants.actions") || "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenants.map((tenant: any) => (
            <TableRow key={tenant.id}>
              <TableCell className="font-medium">{tenant.name}</TableCell>
              <TableCell>{tenant.room}</TableCell>
              <TableCell>{tenant.phone}</TableCell>
              <TableCell>{tenant.moveInDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    tenant.status === "Active"
                      ? "default"
                      : tenant.status === "Pending"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {tenant.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{t("tenants.actions") || "Actions"}</DropdownMenuLabel>
                      <DropdownMenuItem>{t("tenants.viewDetails")}</DropdownMenuItem>
                      <DropdownMenuItem>{t("tenants.editTenant")}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteClick(tenant.id, tenant.name)}
                        disabled={deleteMutation.isPending}
                      >
                        {t("tenants.deleteTenant")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ConfirmDeleteDialog
        open={!!tenantToDelete}
        onOpenChange={(open) => !open && setTenantToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t("tenants.confirmDeleteTitle") || t("app.confirmDeleteTitle")}
        description={`${t("tenants.confirmDeleteDescription") || t("app.confirmDeleteDescription")} (${tenantToDelete?.name})`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
