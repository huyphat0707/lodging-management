"use client";

import { useQuery } from "@tanstack/react-query";
import { communityApi } from "@/lib/api/community";
import { useI18n } from "@/components/providers/LanguageProvider";
import { PostCard } from "./PostCard";
import { Loader2, MessageSquarePlus } from "lucide-react";

export function CommunityFeed() {
  const { t } = useI18n();

  const { data: postsResponse, isLoading, isError } = useQuery({
    queryKey: ["community-posts"],
    queryFn: () => communityApi.getPosts(),
  });

  const posts = postsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-[3px] border-gray-100" />
          <Loader2 className="h-12 w-12 animate-spin absolute inset-0 text-blue-500" style={{ animationDuration: '1s' }} />
        </div>
        <p className="mt-4 text-sm font-medium">{t("community.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-red-50 rounded-2xl border border-red-100">
        <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
          <span className="text-xl">⚠️</span>
        </div>
        <p className="text-sm text-red-600 font-medium">Không thể tải bài đăng. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4 shadow-sm">
          <MessageSquarePlus className="h-8 w-8 text-blue-500" />
        </div>
        <p className="text-base font-semibold text-gray-700">{t("community.empty")}</p>
        <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên chia sẻ bài viết!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
