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

export function ContractTable() {
  const { t } = useI18n();
  const { data: contracts = [], isLoading, isError } = useQuery({
    queryKey: ["contracts"],
    queryFn: api.getContracts,
  });

  if (isLoading) {
    return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">{t("contracts.loading")}</div>;
  }

  if (isError) {
    return <div className="rounded-md border bg-card p-4 text-sm text-red-600">{t("contracts.error")}</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("contracts.tenant")}</TableHead>
            <TableHead>{t("contracts.room")}</TableHead>
            <TableHead>{t("contracts.property")}</TableHead>
            <TableHead>{t("contracts.startDate")}</TableHead>
            <TableHead>{t("contracts.endDate")}</TableHead>
            <TableHead>{t("contracts.monthlyRate")}</TableHead>
            <TableHead>{t("contracts.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.tenantName}</TableCell>
              <TableCell>{contract.roomNumber}</TableCell>
              <TableCell>{contract.propertyName}</TableCell>
              <TableCell>{contract.startDate}</TableCell>
              <TableCell>{contract.endDate}</TableCell>
              <TableCell>{contract.monthlyRate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    contract.status === "Active"
                      ? "default"
                      : contract.status === "Expired"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {t(`contracts.status${contract.status}`)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
