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
import { contractsApi } from "@/lib/api/contracts";
import { useI18n } from "@/components/providers/LanguageProvider";
import {
  MoreHorizontal,
  Printer,
  Pencil,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { CreateContractDialog } from "./CreateContractDialog";
import type { Contract } from "@/lib/api/types";

export function ContractTable() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [contractToDelete, setContractToDelete] = useState<{ id: string; tenantName: string } | null>(null);
  const [contractToEdit, setContractToEdit] = useState<Contract | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: contractsResponse, isLoading, isError } = useQuery({
    queryKey: ["contracts", page, limit],
    queryFn: () => contractsApi.getContracts({ page, limit }),
  });

  const contracts = contractsResponse?.data || [];
  const meta = (contractsResponse as any)?.meta || { current_page: 1, total_pages: 1 };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contractsApi.deleteContract(id),
    onSuccess: () => {
      toast.success(t("contracts.deleteSuccess") || "Contract deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] }); // Status might change
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete contract");
    },
  });

  const handlePrint = (contract: any) => {
    toast.success("Tính năng đang được phát triển...");
  };

  const handleConfirmDelete = () => {
    if (contractToDelete) {
      deleteMutation.mutate(contractToDelete.id);
      setContractToDelete(null);
    }
  };

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
            <TableHead className="text-right">{t("contracts.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.tenant?.name || "-"}</TableCell>
              <TableCell>{contract.room?.roomNumber || "-"}</TableCell>
              <TableCell>{contract.property?.name || "-"}</TableCell>
              <TableCell>{contract.startDate}</TableCell>
              <TableCell>{contract.endDate || "-"}</TableCell>
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
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">{t("app.openMenu")}</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>{t("contracts.actions")}</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handlePrint(contract)}>
                        <Printer className="mr-2 h-4 w-4" />
                        {t("contracts.printContract")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setContractToEdit(contract as any)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t("contracts.editContract")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setContractToDelete({ id: contract.id, tenantName: contract.tenant?.name || "" })}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("contracts.deleteContract")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
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

      <ConfirmDeleteDialog
        open={!!contractToDelete}
        onOpenChange={(open) => !open && setContractToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t("contracts.confirmDeleteTitle")}
        description={`${t("contracts.confirmDeleteDescription")} (${contractToDelete?.tenantName})`}
        isLoading={deleteMutation.isPending}
      />

      {contractToEdit && (
        <CreateContractDialog
          contract={contractToEdit}
          open={!!contractToEdit}
          onOpenChange={(open) => !open && setContractToEdit(null)}
        />
      )}
    </div>
  );
}
