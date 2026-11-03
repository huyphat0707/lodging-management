"use client";

import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { CommunityFeed } from "@/features/community/CommunityFeed";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthContext";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

export default function PublicCommunityPage() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <PublicNavbar />
      
      <main className="flex-1 container mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Banner Welcome */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {t ? t("community.title") : "Cộng đồng HypStay"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t ? t("community.description") : "Không gian chia sẻ và tìm kiếm phòng trọ công khai."}
              </p>
            </div>
          </div>
          
          {isAuthenticated ? (
            <Link href="/admin/community">
              <Button className="bg-blue-600 hover:bg-blue-500 rounded-full shadow-md shadow-blue-500/10 text-xs">
                <Plus className="mr-1.5 h-4 w-4" />
                Đăng bài viết
              </Button>
            </Link>
          ) : (
            <Link href="/admin/login?redirect=/admin/community">
              <Button className="bg-blue-600 hover:bg-blue-500 rounded-full shadow-md shadow-blue-500/10 text-xs">
                <Plus className="mr-1.5 h-4 w-4" />
                Đăng bài viết
              </Button>
            </Link>
          )}
        </div>

        {/* Community Feed */}
        <CommunityFeed />
      </main>
    </div>
  );
}
