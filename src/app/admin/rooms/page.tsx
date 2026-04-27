"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { RoomTable } from "@/features/rooms/RoomTable";
import { CreateRoomDialog } from "@/features/rooms/CreateRoomDialog";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function RoomsPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("rooms.title")}</h2>
            <p className="text-muted-foreground">{t("rooms.description")}</p>
          </div>
          <div className="flex items-center gap-2">
            <CreateRoomDialog />
          </div>
        </div>
        
        <RoomTable />
      </div>
    </AppLayout>
  );
}
