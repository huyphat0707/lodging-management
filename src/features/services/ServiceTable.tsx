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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ServiceTable() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: servicesResponse, isLoading, isError } = useQuery({
    queryKey: ["services", page, limit],
    queryFn: () => (api.getServices as any)({ page, limit }),
  });

  const services = servicesResponse?.data || [];
  const meta = (servicesResponse as any)?.meta || { current_page: 1, total_pages: 1 };

  if (isLoading) {
    return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">{t("services.loading")}</div>;
  }

  if (isError) {
    return <div className="rounded-md border bg-card p-4 text-sm text-red-600">{t("services.error")}</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("services.name")}</TableHead>
            <TableHead>{t("services.type")}</TableHead>
            <TableHead>{t("services.description")}</TableHead>
            <TableHead>{t("services.price")}</TableHead>
            <TableHead>{t("services.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service: any) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{t(`services.type${service.type}`)}</TableCell>
              <TableCell className="text-sm">{service.description || "—"}</TableCell>
              <TableCell>{service.price}</TableCell>
              <TableCell>
                <Badge variant={service.isActive ? "default" : "outline"}>
                  {service.isActive ? t("services.active") : t("services.inactive")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 p-4 pt-0">
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
    </div>
  );
}
