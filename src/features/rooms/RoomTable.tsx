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
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog";

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

  // Fetch rooms based on selected property
  const { data: roomsResponse, isLoading, isError } = useQuery({
    queryKey: ["rooms", selectedProperty],
    queryFn: () => roomsApi.getRooms(selectedProperty),
  });
  const rooms = roomsResponse?.data || [];

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
            {rooms.map((room: any) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.roomNumber}</TableCell>
                <TableCell>{room.propertyName || "-"}</TableCell>
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
                    {room.status}
                  </Badge>
                </TableCell>
                <TableCell>{room.tenant}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                      <span className="sr-only">{t("rooms.openMenu")}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
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
            ))}
          </TableBody>
        </Table>
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
