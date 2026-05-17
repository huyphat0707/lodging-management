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
import { selectFieldClass } from "@/features/properties/property-form-styles";
import { roomsApi } from "@/lib/api/rooms";
import { contractsApi } from "@/lib/api/contracts";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function RoomTable() {
  const { t } = useI18n();
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [roomToDelete, setRoomToDelete] = useState<{ id: string; number: string } | null>(null);
  const queryClient = useQueryClient();

  // Fetch properties for filter dropdown
  const { data: propertiesResponse } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.getProperties(),
  });
  const properties = propertiesResponse?.data || [];

  // Fetch active contracts to determine room tenant
  const { data: contractsResponse } = useQuery({
    queryKey: ["contracts"],
    queryFn: () => contractsApi.getContracts({ limit: 100 }),
  });
  const contracts = contractsResponse?.data || [];

  // Fetch all tenants to list all people in a room
  const { data: tenantsResponse } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => api.getTenants(),
  });
  const allTenants = tenantsResponse?.data || [];

  // Fetch rooms based on selected property
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { data: roomsResponse, isLoading, isError } = useQuery({
    queryKey: ["rooms", selectedProperty, page, limit],
    queryFn: () => roomsApi.getRooms({ propertyId: selectedProperty, page, limit }),
  });
  const rooms = roomsResponse?.data || [];
  const meta = (roomsResponse as any)?.meta || { current_page: 1, total_pages: 1 };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => roomsApi.deleteRoom(id),
    onSuccess: () => {
      toast.success(t("rooms.deleteSuccess") || "Room deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete room");
    },
  });

  const handleDeleteClick = (id: string, roomNumber: string) => {
    setRoomToDelete({ id, number: roomNumber });
  };

  const handleConfirmDelete = () => {
    if (roomToDelete) {
      deleteMutation.mutate(roomToDelete.id);
      setRoomToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">Loading rooms...</div>;
  }

  if (isError) {
    return <div className="rounded-md border bg-card p-4 text-sm text-red-600">Failed to load rooms.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-64">
          <label className="text-sm font-medium mb-2 block">{t("rooms.filterByProperty")}</label>
          <select
            className={selectFieldClass}
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
          >
            <option value="">{t("rooms.allProperties")}</option>
            {properties.map((prop: any) => (
              <option key={prop.id} value={prop.id}>
                {prop.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("rooms.room")}</TableHead>
              <TableHead>{t("rooms.property")}</TableHead>
              <TableHead>{t("rooms.type")}</TableHead>
              <TableHead>{t("rooms.price")}</TableHead>
              <TableHead>{t("rooms.status")}</TableHead>
              <TableHead>{t("rooms.tenant")}</TableHead>
              <TableHead className="text-right">{t("rooms.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room: any) => {
              const property = properties.find((p: any) => p.id === room.propertyId);
              
              // Lấy tất cả khách thuê đang được gán vào phòng này
              const roomTenants = allTenants.filter((t: any) => t.roomId === room.id);
              let displayTenants = "-";
              
              if (roomTenants.length > 0) {
                displayTenants = roomTenants.map((t: any) => t.name).join(", ");
              } else {
                // Fallback trường hợp DB cũ chưa gán roomId cho tenant nhưng contract có
                const activeContract = contracts.find((c: any) => c.roomId === room.id && c.status === "Active");
                if (activeContract?.tenant?.name) displayTenants = activeContract.tenant.name;
                else if (room.tenantName) displayTenants = room.tenantName;
              }
              
              return (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.roomNumber}</TableCell>
                <TableCell>{property?.name || room.propertyName || "-"}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div>{room.type}</div>
                    {room.electricityPrice && (
                      <div className="text-xs text-muted-foreground">
                        ⚡ {room.electricityPrice} · 💧 {room.waterPrice}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{room.price}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      room.status === "Available"
                        ? "default"
                        : room.status === "Occupied"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {t(`rooms.status${room.status}`) || room.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-[150px] truncate" title={displayTenants}>
                    {displayTenants}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">{t("rooms.openMenu")}</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>{t("rooms.actions")}</DropdownMenuLabel>
                        <DropdownMenuItem>{t("rooms.viewDetails")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("rooms.editRoom")}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteClick(room.id, room.roomNumber)}
                          disabled={deleteMutation.isPending}
                        >
                          {t("rooms.deleteRoom")}
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              );
            })}
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

      <ConfirmDeleteDialog
        open={!!roomToDelete}
        onOpenChange={(open) => !open && setRoomToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={t("rooms.confirmDeleteTitle")}
        description={`${t("rooms.confirmDeleteDescription")} (Phòng ${roomToDelete?.number})`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
