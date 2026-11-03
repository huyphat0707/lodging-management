"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Room } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { User, Phone, Mail, Calendar, Home, CreditCard, Zap, Droplet } from "lucide-react";

type RoomDetailsDialogProps = {
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RoomDetailsDialog({ room, open, onOpenChange }: RoomDetailsDialogProps) {
  const { t, language } = useI18n();
  const dateLocale = language === "vi" ? vi : enUS;

  // Fetch properties to get details
  const { data: propertiesResponse } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.getProperties(),
    enabled: open,
  });
  const properties = propertiesResponse?.data || [];
  const property = room ? properties.find((p) => p.id === room.propertyId) : null;

  // Fetch tenants for this room
  const { data: tenantsResponse } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => api.getTenants(),
    enabled: open && room?.status === "Occupied",
  });
  const allTenants = tenantsResponse?.data || [];
  const roomTenants = room ? allTenants.filter((tenant: any) => tenant.roomId === room.id) : [];

  if (!room) return null;

  const formattedPrice = Number(room.price).toLocaleString(language === "vi" ? "vi-VN" : "en-US") + " đ";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Home className="h-5 w-5 text-indigo-500" />
            {t("rooms.room") || "Phòng"} {room.roomNumber}
          </DialogTitle>
          <DialogDescription>
            {property?.name || room.propertyName || ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* General Information */}
          <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-xl border">
            <div>
              <span className="text-xs text-muted-foreground block mb-0.5">{t("rooms.type") || "Loại phòng"}</span>
              <span className="font-semibold text-sm">{room.type}</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block mb-0.5">{t("rooms.status") || "Trạng thái"}</span>
              <Badge
                variant={
                  room.status === "Available"
                    ? "default"
                    : room.status === "Occupied"
                      ? "secondary"
                      : "destructive"
                }
                className="mt-0.5"
              >
                {t(`rooms.status${room.status}`) || room.status}
              </Badge>
            </div>
            <div className="col-span-2 pt-2 border-t flex justify-between items-center">
              <div>
                <span className="text-xs text-muted-foreground block">{t("rooms.price") || "Giá thuê"}</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CreditCard className="h-4 w-4" />
                  {formattedPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Utilities prices */}
          {(room.electricityPrice || room.waterPrice) && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("rooms.utilities") || "Chỉ số dịch vụ"}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {room.electricityPrice && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-amber-500/5">
                    <Zap className="h-5 w-5 text-amber-500" />
                    <div>
                      <span className="text-xs text-muted-foreground block">{t("rooms.electricityPrice") || "Giá điện"}</span>
                      <span className="font-semibold text-sm">{Number(room.electricityPrice).toLocaleString(language === "vi" ? "vi-VN" : "en-US")} đ/kWh</span>
                    </div>
                  </div>
                )}
                {room.waterPrice && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-blue-500/5">
                    <Droplet className="h-5 w-5 text-blue-500" />
                    <div>
                      <span className="text-xs text-muted-foreground block">{t("rooms.waterPrice") || "Giá nước"}</span>
                      <span className="font-semibold text-sm">{Number(room.waterPrice).toLocaleString(language === "vi" ? "vi-VN" : "en-US")} đ/m³</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tenant Information if occupied */}
          {room.status === "Occupied" && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                {t("rooms.tenant") || "Khách thuê phòng"}
              </h4>
              {roomTenants.length > 0 ? (
                <div className="space-y-4">
                  {roomTenants.map((tenant: any) => (
                    <div key={tenant.id} className="p-4 rounded-xl border bg-card space-y-2 shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-foreground">
                        <User className="h-4 w-4 text-indigo-500" />
                        {tenant.name}
                        <Badge variant="outline" className="ml-auto text-[10px] uppercase font-bold text-emerald-600 border-emerald-600 bg-emerald-500/5">
                          {t(`tenants.status${tenant.status}`) || tenant.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground pt-1">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground/75" />
                          <span>{tenant.phone}</span>
                        </div>
                        {tenant.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground/75" />
                            <span className="truncate">{tenant.email}</span>
                          </div>
                        )}
                        {tenant.moveInDate && (
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground/75" />
                            <span>
                              {t("tenants.moveInDate") || "Ngày vào ở"}:{" "}
                              {format(new Date(tenant.moveInDate), "dd/MM/yyyy", { locale: dateLocale })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground italic py-2">
                  {room.tenant ? (
                    <div className="p-4 rounded-xl border bg-card flex items-center gap-2 font-semibold">
                      <User className="h-4 w-4 text-indigo-500" />
                      {room.tenant} (Thông tin chưa chi tiết)
                    </div>
                  ) : (
                    "Chưa có thông tin khách thuê chi tiết"
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
