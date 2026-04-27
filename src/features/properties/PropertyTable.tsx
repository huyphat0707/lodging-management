"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useI18n } from "@/components/providers/LanguageProvider";
import { usePropertyContext } from "@/components/providers/PropertyContext";
import { EditPropertyDialog } from "@/features/properties/EditPropertyDialog";
import type { Property, PropertyType } from "@/lib/api/types";
import { toast } from "sonner";
import { propertiesApi } from "@/lib/api/properties";

function typeLabel(type: PropertyType, t: (k: string) => string) {
  const keys: Record<PropertyType, string> = {
    Boarding: "properties.typeBoarding",
    Hotel: "properties.typeHotel",
    Homestay: "properties.typeHomestay",
  };
  return t(keys[type]);
}

export function PropertyTable() {
  const { t } = useI18n();
  const { selectedPropertyType } = usePropertyContext();
  const [editing, setEditing] = useState<Property | null>(null);
  const queryClient = useQueryClient();

  const { data: propertiesResponse, isLoading, isError } = useQuery({
    queryKey: ["properties", selectedPropertyType],
    queryFn: () => api.getPropertiesByType(selectedPropertyType),
  });

  const properties = propertiesResponse?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertiesApi.deleteProperty(id),
    onSuccess: () => {
      toast.success(t("properties.deleteSuccess") || "Property deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete property");
    },
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-card p-4 text-sm text-muted-foreground">
        {t("properties.loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-border bg-card p-4 text-sm text-destructive">
        {t("properties.error")}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("properties.name")}</TableHead>
              <TableHead>{t("properties.address")}</TableHead>
              <TableHead>{t("properties.type")}</TableHead>
              <TableHead>{t("properties.totalRooms")}</TableHead>
              <TableHead>{t("properties.status")}</TableHead>
              <TableHead>{t("properties.bookings")}</TableHead>
              <TableHead className="text-right">{t("properties.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">{p.address}</TableCell>
                <TableCell>{typeLabel(p.type, t)}</TableCell>
                <TableCell>{p.totalRooms}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      p.status === "Active" ? "default" : p.status === "Draft" ? "secondary" : "outline"
                    }
                  >
                    {p.status === "Active"
                      ? t("properties.statusActive")
                      : p.status === "Inactive"
                        ? t("properties.statusInactive")
                        : t("properties.statusDraft")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground" title={t("properties.bookingsFuture")}>
                    {p.bookingsSummary}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                      <span className="sr-only">{t("properties.openMenu")}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>{t("properties.actions")}</DropdownMenuLabel>
                        <DropdownMenuItem>{t("properties.viewDetails")}</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditing(p)}>
                          {t("properties.editProperty")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleteMutation.isPending}
                        >
                          {t("properties.deleteProperty")}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditPropertyDialog
        property={editing}
        open={!!editing}
        onOpenChange={(next) => {
          if (!next) setEditing(null);
        }}
      />
    </>
  );
}
