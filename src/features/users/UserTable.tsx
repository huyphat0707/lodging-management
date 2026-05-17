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

export function UserTable() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: usersResponse, isLoading, isError } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => (api.getUsers as any)({ page, limit }),
  });

  const users = usersResponse?.data || [];
  const meta = (usersResponse as any)?.meta || { current_page: 1, total_pages: 1 };

  if (isLoading) {
    return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">{t("users.loading")}</div>;
  }

  if (isError) {
    return <div className="rounded-md border bg-card p-4 text-sm text-red-600">{t("users.error")}</div>;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("users.name")}</TableHead>
            <TableHead>{t("users.email")}</TableHead>
            <TableHead>{t("users.phone")}</TableHead>
            <TableHead>{t("users.role")}</TableHead>
            <TableHead>{t("users.status")}</TableHead>
            <TableHead>{t("users.createdAt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {t("users.noUsers")}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin" || user.role === "super_admin"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {t(`users.role${user.role}`)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "Active"
                        ? "default"
                        : "outline"
                    }
                  >
                    {t(`users.status${user.status}`)}
                  </Badge>
                </TableCell>
                <TableCell>{user.createdAt}</TableCell>
              </TableRow>
            ))
          )}
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
