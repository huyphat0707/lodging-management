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

export function UserTable() {
  const { t } = useI18n();
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: api.getUsers,
  });

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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.role === "Admin"
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
