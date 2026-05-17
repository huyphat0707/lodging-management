"use client";

import { useQuery } from "@tanstack/react-query";
import { communityApi } from "@/lib/api/community";
import { useI18n } from "@/components/providers/LanguageProvider";
import { PostCard } from "./PostCard";
import { Loader2, MessageSquare } from "lucide-react";

export function CommunityFeed() {
  const { t } = useI18n();

  const { data: postsResponse, isLoading, isError } = useQuery({
    queryKey: ["community-posts"],
    queryFn: () => communityApi.getPosts(),
  });

  const posts = postsResponse?.data || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>{t("community.loading")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-destructive">
        <p>Error loading posts. Please try again later.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl">
        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">{t("community.empty")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
