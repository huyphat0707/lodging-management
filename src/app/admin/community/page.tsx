"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/components/providers/LanguageProvider";
import { CommunityFeed } from "@/features/community/CommunityFeed";
import { CreatePostDialog } from "@/features/community/CreatePostDialog";

export default function CommunityPage() {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="flex-1 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("community.title")}</h2>
            <p className="text-muted-foreground">{t("community.description")}</p>
          </div>
          <CreatePostDialog />
        </div>

        <div className="max-w-4xl mx-auto">
          <CommunityFeed />
        </div>
      </div>
    </AppLayout>
  );
}
