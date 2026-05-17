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
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: propertiesResponse, isLoading, isError } = useQuery({
    queryKey: ["properties", selectedPropertyType, page, limit],
    queryFn: () => propertiesApi.getProperties({ type: selectedPropertyType, page, limit }),
  });

  const properties = propertiesResponse?.data || [];
  const meta = (propertiesResponse as any)?.meta || { current_page: 1, total_pages: 1 };

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
    if (window.confirm(`${t("app.confirmDeleteDescription")} (${name})`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="rounded-md border bg-card p-8 text-center">{t("properties.loading")}</div>;
  }

  if (isError) {
    return <div className="rounded-md border bg-card p-8 text-center text-destructive">{t("properties.error")}</div>;
  }

  return (
    <>
      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">{t("properties.name")}</TableHead>
              <TableHead className="font-semibold">{t("properties.address")}</TableHead>
              <TableHead className="font-semibold">{t("properties.type")}</TableHead>
              <TableHead className="font-semibold">{t("properties.totalRooms")}</TableHead>
              <TableHead className="font-semibold">{t("properties.status")}</TableHead>
              <TableHead className="font-semibold">{t("properties.bookings")}</TableHead>
              <TableHead className="text-right font-semibold">{t("properties.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("properties.noProperties")}
                </TableCell>
              </TableRow>
            ) : (
              properties.map((p: Property) => (
                <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
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
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("properties.openMenu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {t("app.previous") || "Trước"}
        </Button>
        <div className="text-sm text-muted-foreground mx-2">
          {t("app.page") || "Trang"} {meta.current_page} / {meta.total_pages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= (meta.total_pages || 1)}
        >
          {t("app.next") || "Sau"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
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
