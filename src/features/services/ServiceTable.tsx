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

export function ServiceTable() {
  const { t } = useI18n();
  const { data: services = [], isLoading, isError } = useQuery({
    queryKey: ["services"],
    queryFn: api.getServices,
  });

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
          {services.map((service) => (
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
    </div>
  );
}
